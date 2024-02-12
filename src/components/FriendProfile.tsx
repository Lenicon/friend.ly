import { useContext, useEffect, useState } from 'react';
import Avatar from './Avatar';
import { Context } from '../context/Context';
import "../assets/css/friendProfile.css";
import { getConversationAsync, getUserAsync } from '../services/chatServices';

export default function FriendProfile({ open, setOpen }) {
    const { currentChat } = useContext(Context);
    const [userFriend, setUserFriend] = useState(null);
    const friend = currentChat?.friend;

    const [revealed, setRevealed] = useState(false);

    useEffect(()=>{
        loadFriendRevealInfo();
    }, [currentChat?.revealed])

    useEffect(()=>{
        getUser(friend?.id);
    }, [revealed])

    const loadFriendRevealInfo = async () =>{
        if (currentChat?.revealed.includes(friend?.id)){
            console.log(friend);
            return setRevealed(true);
        }else return setRevealed(false);
    }

    const getUser = async (id) =>{
        const l = await getUserAsync(id);
        return setUserFriend(l);
    }

    return (
        <div className={open ? "friendProfile active" : "friendProfile"}>
            <div className='friendProfile-wrapper'>
                <div className='friendProfile-topbar'>
                    <span className='heading'>Friend Profile</span>
                    <div className='app-icon' onClick={() => setOpen(false)}>
                        <i className='fa-solid fa-xmark'></i>
                    </div>
                </div>

                {!revealed?
                    (<div className='friendProfile-infos'>
                        <div className='avatar-wrapper'>
                            <Avatar src={friend?.uProfile ? friend.uProfile : ""} height={150} width={150} />
                        </div>
                        <span className='realname'>{friend?.username}</span>
                        <p className='email'>{`[Identity Hidden...]`}</p>
                        <div className='description'>
                            <div className='user-desc'>
                                {friend?.desc}
                            </div>
                            
                            <div className='tags-wrapper'>
                                {friend?.tags.map((tag, index) => (
                                    <div className='tag-item' key={index}>
                                        <span className='text'>#{tag}{index+1==friend.tags.length ? "":","}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    </div>)
                    :
                    (<div className='friendProfile-infos'>
                        <div className='avatar-wrapper'>
                            <Avatar src={friend?.profile ? friend.profile : ""} height={150} width={150} />
                        </div>
                        <span className='realname'>{friend?.fname} {friend?.lname}</span>
                        
                        <p className='email'>{userFriend?.email}</p>
                        <p className='email'>{userFriend?.block}</p>
                        <div className='description'>
                            <div className='user-desc'>
                                {friend?.desc}
                            </div>
                            
                            <div className='tags-wrapper'>
                                {friend?.tags.map((tag, index) => (
                                    <div className='tag-item' key={index}>
                                        <span className='text'>#{tag}{index+1==friend.tags.length ? "":","}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    </div>)
                }

            </div>
        </div>
    )
}
