import { useState, useContext, useEffect, useRef } from 'react';
import '../assets/css/content.css';
import Avatar from './Avatar';
import Message from './Message';
import ImageSlider from './ImageSlider';
import InfoContainer from './InfoContainer';
import { Context } from '../context/Context';
import { v4 as getID } from 'uuid';
import { countMsgs, createMessageAsync,getMsgQueryByConversationId, getSnapshotData, updateRevealedAsync } from '../services/chatServices';
import { onSnapshot } from 'firebase/firestore';
import FriendProfile from './FriendProfile';
import Compressor from 'compressorjs';
import Dialog from './Dialog';
import Confirm from './ConfirmDialog';


export default function Content() {
    const { currentChat, auth, dispatch } = useContext(Context)
    const friend = currentChat?.friend;

    const [onMenu, setOnMenu] = useState(false);
    const [onViewer, setOnViewer] = useState(false);

    const [messages, setMessages] = useState([]);
    const [limitSize, setLimitSize] = useState(20);

    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [msgImages, setMsgImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [onFriendProfile, setOnFriendProfile] = useState(false);

    const [cdRev, setCDRev] = useState(false);
    const [dalert, setDalert] = useState("");

    const [dragActive, setDragActive] = useState(false);

    // TOUCH SWIPING

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50
    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd;
        const isRSwipe = distance < -minSwipeDistance;
        const isLSwipe = distance > minSwipeDistance;

        if (isRSwipe && !onViewer) {
            if (onFriendProfile) return setOnFriendProfile(false);
            return handleCloseChat();
        }
        if (isLSwipe && !onFriendProfile && !onViewer) return setOnFriendProfile(true);
    }


    const scrollRef = useRef(null);

    const [revealed, setRevealed] = useState(false);
    const [uRevealed, setURevealed] = useState(false);


    useEffect(() => {
        loadFriendRevealInfo();
        loadUserRevealInfo();
    }, [currentChat?.revealed])


    const loadFriendRevealInfo = () => {
        if (currentChat?.revealed.includes(friend?.id)) {
            return setRevealed(true);
        } else return setRevealed(false);
    }

    const loadUserRevealInfo = () => {
        if (currentChat?.revealed.includes(auth.id)) {
            return setURevealed(true);
        } else return setURevealed(false);
    }


    // -- MESSAGE LOADING -- //
    useEffect(() => {
        if (limitSize == 20){
            return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(()=>{
        setLimitSize(20);
    }, [message])

    useEffect(() => {
        loadMessages();
    }, [currentChat, limitSize]);

    const loadMessages = () => {
        if (currentChat == null) return;
        try {
            const query = getMsgQueryByConversationId(currentChat.id, limitSize);
            onSnapshot(query, snapshots => {
                let tmpMessages = [];
                snapshots.forEach(snapshot => {
                    tmpMessages.push(getSnapshotData(snapshot));
                });
                setMessages(tmpMessages.sort((a,b)=>a.createdAt-b.createdAt));
            })
        } catch (error) {
            console.error(error)
        }
    };

    const handleScrollCheck = async(e) => {
        const top = Math.abs(e.target.scrollTop) < 0.5;
        const l = await countMsgs(currentChat.id)
        if (top && messages.length != l) {
            limiterrahh(5, 2);
        };
    }

    const limiterrahh = (num, seconds) => {
        setLimitSize(prev=>prev+num);
        setTimeout(()=>limiterrahh(num, seconds), seconds*1000);
    }

    // -- MESSAGE LOADING end -- //

    // -- MESSAGE HANDLING -- //

    const openImageViewer = (images) => {
        setMsgImages(images);
        setOnViewer(true);
    };

    const closeImageViewer = () => {
        setMsgImages([]);
        setOnViewer(false);
    };

    const handleImages = async (e, t = 0) => {
        let files;

        switch (t) {
            case 0:
                files = [...e.target.files];
                break;
            case 1:
                files = [...e.clipboardData.files];
                break;
            case 2:
                e.preventDefault();
                files = [...e.dataTransfer.files];
                break;
            default:
                files = [...e.target.files];
                break;
        }

        if (files) {
            for (let i = 0; i < files.length; i++) {
                new Compressor(files[i], {
                    quality: 0.2,
                    success(res) {
                        files[i] = res;
                        const id = getID();
                        const img = {
                            id,
                            origin: files[i].name,
                            filename: id + "-" + files[i].name,
                            file: files[i],
                            fileSize: files[i].size
                        };

                        setImages((prev) => [...prev, img])
                    },
                    error(err) {
                        console.error(err);
                    }
                });

            }
        }
    };

    const handleRemoveImage = (id) => {
        setImages(
            (prev) => prev.filter(
                (image) => image.id !== id
            )
        );
    };

    const handleCreateMessageSystem = async (message) => {
        if (currentChat == null) return;
        setLoading(true);
        try {
            const msg = {
                sender: auth.id,
                receiver: currentChat.friend.id,
                message,
                images: []
            };

            const res = await createMessageAsync(msg, images, currentChat.id);
            if (res) {
                // clear inputs if success
                setMessage("");
                setImages([]);
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    }

    const handleCreateMessage = async () => {
        setLimitSize(20);
        if (currentChat == null) return;
        if (!message && images?.length == 0) return;
        if (images) {
            let fs = 0;
            for (let i = 0; i < images.length; i++) {
                fs += images[i].fileSize;
            }
            if (fs > 2000000) {
                return setDalert("Total file size should not be more than 2MB.");
            }
        }

        setLoading(true)

        try {
            const msg = {
                sender: auth.id,
                receiver: currentChat.friend.id,
                message,
                images: []
            };

            const res = await createMessageAsync(msg, images, currentChat.id);
            if (res) {
                // clear inputs if success
                setMessage("");
                setImages([]);
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    // -- MESSAGE HANDLING end -- //

    const handleCloseChat = () => {
        setLimitSize(20);
        setOnFriendProfile(false);
        setOnViewer(false);
        dispatch({ type: "SET_CURRENT_CHAT", payload: null });
        localStorage.setItem("convId", null);
    }

    const handleFriendProfile = () => {
        if (onFriendProfile) setOnFriendProfile(false);
        else setOnFriendProfile(true);
    }

    const handleRevealIdentity = async () => {
        setLimitSize(20);
        if (currentChat?.last.message == "XXCONVO_FIRSTMESSAGEXX") {
            return setDalert("You can't reveal yourself yet, talk to them first.");
        }
        if (uRevealed == false) {
            await updateRevealedAsync(currentChat?.id, auth?.id);
            await handleCreateMessageSystem(`${auth.username} has revealed their identity to you!`);
            await setURevealed(true);
        } else return setDalert("You have already revealed yourself to this person.")

        return setCDRev(false);
    }


    return (
        <div
            

            onDropCapture={async(e) => {handleImages(e, 2); await setDragActive(false)}}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const { relatedTarget } = e;
                if (!relatedTarget) {
                    setDragActive(false);
                }
            }}

            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`content${currentChat ? " active" : ""}`}>
            <Dialog open={dalert != "" ? true : false} onClose={() => setDalert("")}>
                {dalert}
            </Dialog>

            {dragActive && (
                <div className='dropFile'>
                    <span>Drop Here</span>
                    <input
                        className='dropuploadinput'
                        aria-label='imgupload'
                        type='file'
                        accept='.jpg,.jpeg,.png,.gif'
                        multiple
                    >
                    </input>
                </div>
            )}

            <Confirm
                open={cdRev}
                onClose={() => setCDRev(false)}
                onConfirm={() => {
                    handleRevealIdentity();
                    //setMessage(`${auth.username} has revealed their identity to you! Refresh to see the changes.`);
                }}
                title='Reveal Identity'
            >
                {`Are you ready to take the next step with ${revealed ? `${friend?.fname} ${friend?.lname}` : friend?.username}? Clicking "Yes" means sharing some basic info like your name and face. Prefer to stay anonymous for now? Click "No".`}
            </Confirm>

            {currentChat ? (
                <div className='wrapper'>
                    <FriendProfile open={onFriendProfile} setOpen={setOnFriendProfile} />
                    <div className='top'>
                        <div className='activateFriendProfile' onClick={handleFriendProfile}>
                            <Avatar
                                src={revealed ? (friend?.profile ? friend.profile : "") : (friend?.uProfile ? friend.uProfile : "")}
                                username={revealed ? `${friend?.fname} ${friend?.lname}` : friend?.username}
                                height={50}
                                width={50}
                            />
                        </div>
                        <div
                            className="app-icon menu-icon"
                            onClick={() => setOnMenu((prev) => !prev)}
                        >

                            <i className='fa-solid fa-ellipsis'></i>
                            {onMenu && (
                                <div className="menu-wrapper">
                                    {/* <span className='menu-item'>Reveal</span> */}
                                    <span title='See the profile of this user.' className='menu-item' onClick={handleFriendProfile}>User Profile</span>
                                    {uRevealed == false ? (<span title='Reveal YOUR identity to this user.' className='menu-item' onClick={() => setCDRev(true)}>Reveal Identity</span>) : (<></>)}
                                    {/* <span className='menu-item' onClick={handleCloseChat}>Close Chat</span> */}
                                    <span title='Report this user to the Admins.' className='menu-item' onClick={() => window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform?usp=pp_url&entry.1263217725=User+Report&entry.1128661337=${auth.id}&entry.379855328=${currentChat.id}&entry.1414077091=${auth.id}&entry.481005644=${auth.id}`, "_blank")}>Report User</span>
                                    <span title='Close this chat.' className='menu-item' onClick={handleCloseChat}>Close Chat</span>

                                </div>
                            )}
                        </div>
                    </div>
                    <div className='center'
                    
                    onClick={() => setOnFriendProfile(false)}>
                        {msgImages.length > 0 && onViewer ? (
                            <div className='image-viewer-wrapper'>
                                <ImageSlider
                                    images={msgImages}
                                    onClose={closeImageViewer}
                                />
                            </div>
                        ) : (
                            <div className='messages-wrapper' onScroll={(e)=>handleScrollCheck(e)}>
                                
                                {messages.filter((item, index)=>messages.indexOf(item) == index).map((msg, index) => (
                                    <Message
                                        
                                        key={msg?.id}
                                        msg={msg}
                                        owner={msg?.sender == auth?.id}
                                        openImageViewer={openImageViewer}
                                        scrollRef={messages.length - 1 == index ? scrollRef : null}
                                    />
                                ))
                                }
                            </div>
                        )}
                    </div>
                    <div className='bottom' onClick={() => setOnFriendProfile(false)}>
                        {images.length > 0 && (
                            <div className="images-preview">
                                {images.map(image => (
                                    <div className="image-item" key={image?.id} onClick={() => handleRemoveImage(image.id)}>
                                        <img src={URL.createObjectURL(image?.file)} alt="" />
                                        <i onClick={() => handleRemoveImage(image.id)} className='fa-solid fa-rectangle-xmark'></i>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label htmlFor='upload-images'>
                            <div className='app-icon'>
                                <input
                                    placeholder='uploadimages'
                                    title='Upload images under 2MB.'
                                    aria-label='imgupload'
                                    type='file'
                                    accept='.jpg,.jpeg,.png,.gif'
                                    id='upload-images'
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={handleImages}
                                />
                                <i className='fa-solid fa-image'></i>
                            </div>
                        </label>
                        <textarea
                            onPasteCapture={(e) => handleImages(e, 1)}
                            
                            maxLength={160}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') {
                                    handleCreateMessage();
                                }
                            }}
                            placeholder='Write a message'
                        />
                        <button className='app-icon' disabled={loading} onClick={handleCreateMessage}>
                            {loading ?
                                <i className='fa-solid fa-spinner rotate'></i>
                                :
                                <i className='fa-solid fa-paper-plane'></i>
                            }
                        </button>

                    </div>
                </div>
            ) : (
                <InfoContainer />
            )}


        </div>
    )
}
