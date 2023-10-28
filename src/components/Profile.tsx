import {useState, useContext} from 'react';
import "../assets/css/profile.css";
import Avatar from './Avatar';
import { Context } from '../context/Context';

export default function Profile({open, setOpen}) {
    const { auth, user, dispatch } = useContext(Context);
    const [onEdit, setOnEdit] = useState(false);
    const [username, setUsername] = useState("");
    const [desc, setDesc] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const handleOnEdit = () => {
        if(!user) return;
        setUsername(user.username);
        setDesc(user.desc);
        setOnEdit(true);
    }

    console.log(user, auth);
    return (
    <div className={open? "profile active": "profile"}>
        <div className='profile-wrapper'>
            <div className='profile-topbar'>
                <span className='heading'>Profile</span>
                <div className='app-icon' onClick={()=>setOpen(false)}>
                    <i className='fa-solid fa-xmark'></i>
                </div>
            </div>

            { onEdit ? (
                <div className="profile-infos">
                    <div className="avatar-wrapper">
                        <Avatar height={150} width={150}/>
                        <i className="fa-solid fa-camera"></i>
                    </div>
                    <form onSubmit={()=>{}} className="profile-form">
                        <input type="text" placeholder="First Name"/>
                        <input type="text" placeholder="Last Name"/>
                        <textarea typeof="text" placeholder="Write something about you."/>
                        <div className="profile-actions">
                            <button className="cancel-btn" onClick={()=>setOnEdit(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className='profile-infos'>
                    <div className='avatar-wrapper'>
                        <Avatar src={user?.profile? user.profile.url : ""} height={150} width={150}/>
                    </div>
                    <span className='username'>{user?.fname} {user?.lname}</span>
                    <span className='email'>{user?.email}</span>
                    <span className='email'>{user?.username}</span>
                    <p className='status'>{user?.desc}</p>
                    <button className='edit-btn' onClick={()=>setOnEdit(true)}>
                        <i className="fa-solid fa-pen-to-square"></i>Profile
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}
