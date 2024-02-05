import { useContext } from 'react';
import Avatar from './Avatar';
import { Context } from '../context/Context';
import "../assets/css/friendProfile.css";

export default function FriendProfile({ open, setOpen }) {
    const { currentChat } = useContext(Context);
    const friend = currentChat.friend;

    return (
        <div className={open ? "friendProfile active" : "friendProfile"}>
            <div className='friendProfile-wrapper'>
                <div className='friendProfile-topbar'>
                    <span className='heading'>Friend Profile</span>
                    <div className='app-icon' onClick={() => setOpen(false)}>
                        <i className='fa-solid fa-xmark'></i>
                    </div>
                </div>

                <div className='friendProfile-infos'>
                    <div className='avatar-wrapper'>
                        <Avatar src={friend?.uProfile ? friend.uProfile : ""} height={150} width={150} />
                    </div>
                    <span className='realname'>{friend?.username}</span>
                    {/* <span className='email'>{"⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎@usc.edu.ph"}</span> */}
                    <p className='email'>{`[Other Info Hidden...]`}</p>
                    <div className='description'>
                        {/* <div className='desc-label'>About:</div>
                        <div>{friend?.desc}asdasdasdsadasdasdasdsdsasdasdadadasdasdasdasdasdd</div> */}
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
                    {/* {friend.revealed ?"" : <p className='revealed'>Furthur Information Unrevealed Yet</p>} */}
                    
                </div>
            </div>
        </div>
    )
}
