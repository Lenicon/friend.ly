import {useState, useContext} from 'react';
import "../assets/css/profile.css";
import Avatar from './Avatar';
import { Context } from '../context/Context';

export default function Profile({open, setOpen}) {
    const { auth, user, dispatch } = useContext(Context);
    const [onEdit, setOnEdit] = useState(false);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [desc, setDesc] = useState("");

    const [profileImage, setProfileImage] = useState(null);

    const handleOnEdit = () => {
        if(!user) return;
        setFname(user.fname);
        setLname(user.lname);
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
                        <input onChange={(e)=>setFname(e.target.value)} type="text" placeholder="First Name"/>
                        <input onChange={(e)=>setLname(e.target.value)} type="text" placeholder="Last Name"/>
                        <textarea required onChange={(e)=>setDesc(e.target.value)} typeof="text" placeholder="Write something about you."/>
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
                    <span className='realname'>{user?.fname} {user?.lname}</span>
                    <span className='email'>{user?.email}</span>
                    <span className='username'>{user?.username}</span>
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
