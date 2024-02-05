import { useState, useContext, useEffect, useRef } from 'react';
import '../assets/css/content.css';
import Avatar from './Avatar';
import Message from './Message';
import ImageSlider from './ImageSlider';
import InfoContainer from './InfoContainer';
import { Context } from '../context/Context';
import {v4 as getID} from 'uuid';
import { createMessageAsync, getMsgQueryByConversationId, getSnapshotData } from '../services/chatServices';
import { onSnapshot } from 'firebase/firestore';
import FriendProfile from './FriendProfile';
import Compressor from 'compressorjs';

// type Props={
//     chat: boolean,
//     setChat: (chat: boolean)=>void
// }

export default function Content() {
    const {currentChat, auth, dispatch, user} = useContext(Context)
    const friend = currentChat?.friend;
    
    const [onMenu, setOnMenu] = useState(false);
    const [onViewer, setOnViewer] = useState(false);
    const [messages, setMessages] = useState([]);
    
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [msgImages, setMsgImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [onFriendProfile, setOnFriendProfile] = useState(false);


    const scrollRef = useRef(null);

    useEffect(()=>{
        return scrollRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages]);

    useEffect(()=>{
        const loadMessages = async () => {
            if (currentChat == null) return;
            try {
                const query = getMsgQueryByConversationId(currentChat.id);
                onSnapshot(query, snapshots=>{
                    let tmpMessages = [];
                    snapshots.forEach(snapshot=>{
                        tmpMessages.push(getSnapshotData(snapshot));
                    });
                    setMessages(tmpMessages.sort((a,b)=>a.createdAt - b.createdAt));
                })
            } catch (error) {
                console.log(error)
            }
        };

        loadMessages();
    }, [currentChat]);

    const openImageViewer = (images) => {
        setMsgImages(images);
        setOnViewer(true);
    };

    const closeImageViewer = () => {
        setMsgImages([]);
        setOnViewer(false);
    };

    const handleImages = async (e) => {
        const files = [...e.target.files];
        if (files) {
            for (let i = 0; i < files.length; i++) {
                new Compressor(files[i], {
                    quality: 0.2,
                    success(res){
                        files[i] = res;
                        const id = getID();
                        const img = {
                            id,
                            origin: files[i].name,
                            filename: id+"-"+files[i].name,
                            file: files[i],
                            fileSize: files[i].size
                        };

                        setImages((prev)=>[...prev, img])

                        console.log(files[i].size)
                    },
                    error(err){
                        console.error(err);
                    }
                });

                // const id = getID();
                // const img = {
                //     id,
                //     origin: files[i].name,
                //     filename: id+"-"+files[i].name,
                //     file: files[i],
                //     fileSize: files[i].size
                // };

                // setImages((prev)=>[...prev, img])
            }
        }
    };

    const handleRemoveImage = (id) =>{
        setImages(
            (prev)=>prev.filter(
                (image)=>image.id !== id
            )
        );
    };

    const handleCreateMessage = async() => {
        if (currentChat == null) return;
        if (!message && images?.length == 0) return;
        if (images) {
            let fs = 0;
            for (let i = 0; i < images.length; i++) {
                fs += images[i].fileSize;
            }
            if(fs > 2000000) {
                console.log(fs);
                return alert("Warning: File Size should not be more than 2MB!");
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
            if(res){
                // clear inputs if success
                setMessage("");
                setImages([]);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    };

    const handleCloseChat = () => {
        dispatch({ type: "SET_CURRENT_CHAT", payload: null });
        localStorage.setItem("convId", null);
    }

    const handleFriendProfile = () => {
        if (onFriendProfile) setOnFriendProfile(false);
        else setOnFriendProfile(true);
    }

    return (
    <div className={currentChat? "content active": "content"}>
        {  currentChat ? (
            <div className='wrapper'>
                <FriendProfile open={onFriendProfile} setOpen={setOnFriendProfile}/>
                <div className='top'>
                    <div className='activateFriendProfile' onClick={handleFriendProfile}>
                        <Avatar
                            src={friend?.uProfile ? friend.uProfile:""}
                            username={friend?.username}
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
                            <span className='menu-item' onClick={handleFriendProfile}>Profile</span>
                            <span className='menu-item' onClick={handleCloseChat}>Close Chat</span>
                            <span className='menu-item' onClick={()=>window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform?usp=pp_url&entry.1263217725=User+Report&entry.1128661337=${auth.id}&entry.379855328=${currentChat.id}&entry.1414077091=${auth.id}&entry.481005644=${auth.id}`, "_blank")}>Report</span>
                        </div>
                        )}
                    </div>
                </div>
                <div className='center'>
                    { msgImages.length > 0 && onViewer ? (
                        <div className='image-viewer-wrapper'>
                            <ImageSlider
                                images={msgImages}
                                onClose={closeImageViewer}
                            />
                        </div>
                    ) : (
                        <div className='messages-wrapper'>
                            {messages.map((msg, index)=>(
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
                <div className='bottom'>
                    {images.length > 0 && (
                        <div className="images-preview">
                            {images.map(image=>(
                                <div className="image-item" key={image?.id}>
                                    <img src={URL.createObjectURL(image?.file)} alt=""/>
                                    <i onClick={()=>handleRemoveImage(image.id)} className='fa-solid fa-rectangle-xmark'></i>
                                </div>
                            ))}
                        </div>
                    )}
                    <label htmlFor='upload-images'>
                        <div className='app-icon'>
                            <input
                                type='file'
                                accept='.jpg,.jpeg,.png,.gif'
                                id='upload-images'
                                multiple
                                style={{display:"none"}}
                                onChange={handleImages}
                            />
                            <i className='fa-solid fa-image'></i>
                        </div>
                    </label>
                        <textarea
                            maxLength={160}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={loading}
                            onKeyDown={(e)=>{
                                if (e.key == 'Enter'){
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
