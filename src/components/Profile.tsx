import {useState, useContext} from 'react';
import "../assets/css/profile.css";
import Avatar from './Avatar';
import { Context } from '../context/Context';
import {v4 as getID} from "uuid";
import { updateUserAsync } from '../services/chatServices';
import { updateProfile } from '../context/Actions';

export default function Profile({open, setOpen}:{open:any, setOpen:any}) {
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
    };

    const handleCancel = (e)=>{
        e.preventDefault();
        setOnEdit(false);
    }

    const handleImages = (e) => {
        const file = e.target.files[0];
        const Image = {
            origin: file.name,
            filename: getID() + "-" + file.name,
            file
        };
        setProfileImage(Image);
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const tempUser = {
                fname,
                lname,
                desc: desc ? desc: "Nice to meet you, I hope we can be friends!"
            }

            const res = await updateUserAsync(tempUser, profileImage);
            if (res){
                dispatch(updateProfile(res));
            }
            setOnEdit(false);
        } catch (error){
            console.log(error);
        }
    }

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
                        {profileImage? (
                            <Avatar
                                src={profileImage? URL.createObjectURL(profileImage.file):""} 
                                height={150} 
                                width={150}
                            />
                            ) : (
                            <Avatar
                                src={user?.profile ? user.profile.url : ""}
                                height={150}
                                width={150}
                            />
                        )}
                        <label htmlFor="upload-image">
                            <input
                                style={{display:"none"}}
                                type="file"
                                accept='.jpg,.jpeg,.png' 
                                id="upload-image"
                                onChange={handleImages}
                            />
                            <i className="fa-solid fa-camera"></i>
                        </label>
                    </div>
                    <span className='note'>Image must show your face!</span>
                    <form onSubmit={handleSubmit} className="profile-form">
                        <input required value={fname} onChange={(e)=>setFname(e.target.value)} type="text" placeholder="First Name"/>
                        <input required value={lname} onChange={(e)=>setLname(e.target.value)} type="text" placeholder="Last Name"/>
                        <textarea value={desc} required onChange={(e)=>setDesc(e.target.value)} typeof="text" placeholder="Write something about you."/>
                        <div className="profile-actions">
                            <button className="cancel-btn" onClick={handleCancel}>
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
                        <Avatar src={user?.profile ? user.profile.url : ""} height={150} width={150}/>
                    </div>
                    <span className='realname'>{user?.fname} {user?.lname}</span>
                    <span className='email'>{user?.email}</span>
                    <span className='username'>{user?.username}</span>
                    <p className='status'>{user?.desc}</p>
                    <button className='edit-btn' onClick={handleOnEdit}>
                        <i className="fa-solid fa-pen-to-square"></i>Profile
                    </button>
                </div>
            )}
        </div>
    </div>
  )
}
