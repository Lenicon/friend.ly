import { useState, useContext } from 'react';
import "../assets/css/profile.css";
import Avatar from './Avatar';
import { Context } from '../context/Context';
import { v4 as getID } from "uuid";
import { updateUserAsync } from '../services/chatServices';
import { updateProfile } from '../context/Actions';
import TagsInput from './TagsInput';

export default function Profile({ open, setOpen, setDalert }) {
    const { user, dispatch, auth } = useContext(Context);
    const [onEdit, setOnEdit] = useState(false);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState([]);

    const [profileImage, setProfileImage] = useState(null);

    const handleOnEdit = () => {
        if (!user) return;
        setFname(user.fname);
        setLname(user.lname);
        setDesc(user.desc);
        setOnEdit(true);
        setTags(user.tags);
    };

    const handleCancel = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tempUser = {
                fname,
                lname,
                desc: desc ? desc : "Nice to meet you, I hope we can be friends!",
                tags
            }

            const res = await updateUserAsync(tempUser, profileImage);
            if (res) {
                dispatch(updateProfile(res));
            }
            setOnEdit(false);
        } catch (error) {
            console.error(error);
        }
    }

    function copyClipboard(a){
        if (window.isSecureContext) {
            navigator.clipboard.writeText(a);
            setDalert("Copied User ID to clipboard!");
        }
        else setDalert("Could not copy User ID to clipboard.");
    }

    return (
        <div className={open ? "profile active" : "profile"}>
            <div className='profile-wrapper'>
            {/* <Dialog open={dalert==""?false:true} onClose={()=>setDalert("")}>
                {dalert}
            </Dialog> */}
                <div className='profile-topbar'>
                    <span className='heading'>Profile</span>
                    <div className='app-icon' onClick={() => setOpen(false)}>
                        <i className='fa-solid fa-xmark'></i>
                    </div>
                </div>

                {onEdit ? (
                    <div className="profile-infos">

                        <div className="avatar-wrapper">
                            <label className='upload-image' htmlFor="upload-image">
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    accept='.jpg,.jpeg,.png'
                                    id="upload-image"
                                    onChange={handleImages}
                                />

                                {profileImage ? (
                                    <Avatar
                                        src={profileImage ? URL.createObjectURL(profileImage.file) : ""}
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

                                <i className="fa-solid fa-camera"></i>
                            </label>
                        </div>
                        <span className='note'>Image must show your face!</span>
                        <form id='profileForm' onSubmit={handleSubmit} className="profile-form">
                            <input required value={fname} onChange={(e) => setFname(e.target.value)} type="text" placeholder="First Name" />
                            <input required value={lname} onChange={(e) => setLname(e.target.value)} type="text" placeholder="Last Name" />
                            <textarea value={desc} required onChange={(e) => setDesc(e.target.value)} typeof="text" placeholder="Write something about you." />
                            <TagsInput tags={tags} setTags={setTags} />

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
                            <Avatar src={user?.profile ? user.profile.url : ""} height={150} width={150} />
                        </div>
                        <span className='realname'>{user?.fname} {user?.lname}</span>
                        <span className='email'>{user?.email}</span>
                        <span className='username'>{user?.username}</span>
                        <div className='description'>
                            {/* <div className='desc-label'>About:</div> */}
                            <p className='user-desc'>{user?.desc}</p>
                            {/* {user?.desc} */}
                            
                            <div className='tags-wrapper'>
                            {user?.tags?.map((tag, index) => (
                                <div className='tag-item' key={index}>
                                    <span className='text'>#{tag}{index+1==tags.length ? "":","}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        
                        <button className='edit-btn' onClick={handleOnEdit}>
                            <i className="fa-solid fa-pen-to-square"></i>Profile
                        </button>
                        <a className='user-id' title='Copy ID to Clipboard!' onClick={()=>copyClipboard(auth.id)}>User ID: {auth.id}</a>
                    </div>
                )}
            </div>
        </div>
    )
}
