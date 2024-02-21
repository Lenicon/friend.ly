import {useContext, useEffect, useState} from 'react';
import "../assets/css/sidebar.css";

import Avatar from './Avatar';
import ChatItem from './ChatItem';
import Profile from './Profile';
import { logoutAsync } from '../services/authServices';
import { Context } from '../context/Context';
import { signOut } from '../context/Actions';
import {
    createConversationAsync,
    getConversationAsync,
    getConversationsQueryByUser,
    getSnapshotData,
    getUserAsync,
    updateMatchesAsync
} from '../services/chatServices';
import { onSnapshot } from 'firebase/firestore';
import Friendr from "../components/Friendr";
import Dialog from './Dialog';

// type Props = {
//     setChat: (chat: boolean) => void,
// }

export default function SideBar() {
    const { auth, user, users, dispatch, chats, currentChat } = useContext(Context);
    const [newChat, setNewChat] = useState(false);
    const [onProfile, setOnProfile] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState([]);
    
    const [dalert, setDalert] = useState("");

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
        const distance = touchStart - touchEnd
        const isLSwipe = distance > minSwipeDistance;
        const isRSwipe = distance <- minSwipeDistance;
        if (isLSwipe && !onProfile){
            if (localStorage.getItem("prevConv") == null) return;
            else return handleSelectConversation(JSON.parse(localStorage.getItem("prevConv")));
        }
        if (isRSwipe && !onProfile) return setOnProfile(true);
    }

    useEffect(()=>{
        users && setContacts(users);
        chats && setConversations(chats);
    }, [users, chats]);

    const handleSearch=(e)=>{
        const toSearch = e.target.value;
        
        //search conversations
        if (toSearch) {
            setConversations(
                chats.filter((chat) =>
                    chat.friend.username.toLowerCase().includes(toSearch.toLowerCase())
                    // ||
                    // `${chat.friend.fname} ${chat.friend.lname}`.toLowerCase().includes(toSearch.toLowerCase())
                )
            )
        } else {
            setConversations(chats);
        }
        
    }

    useEffect(()=>{
        loadConversations();
    }, [auth, users]);


    const loadConversations = () => {
        if (auth == null || users.length == 0) return;
        const query = getConversationsQueryByUser(auth.id);
        onSnapshot(query, (snapshots) => {
          const tmpConversations = [];
          snapshots.forEach((snapshot) => {
            const conv = getSnapshotData(snapshot);
            const friendId = conv.members.find((id) => id !== auth.id);
            const friend = users.find((contact) => contact.id === friendId);
            if (friend) {
              tmpConversations.push({
                ...conv,
                friend: {
                  id: friendId,
                  uscID: friend.uscID,
                  username: friend.username,
                  lname: friend.lname,
                  fname: friend.fname,
                  uProfile: friend.uProfile,
                  profile: friend.profile ? friend.profile.url : "",
                  desc: friend.desc,
                  tags: friend.tags,
                  matches: friend.matches
                },
              });
            }
          });
          dispatch({ type: "LOAD_CHATS", payload: tmpConversations });
          const convId = JSON.parse(localStorage.getItem("convId"));
          if (convId) {
            const currChat = tmpConversations.find((c) => c.id === convId);
            dispatch({ type: "SET_CURRENT_CHAT", payload: currChat });
          }
        });
      };

    function algorithm(tagArrA, tagArrB, matchVal) {
        var tagVal = 1;
        for (let i=0; i<tagArrA.length; i++) {
            if (tagArrB.indexOf(tagArrA[i]) != -1)
                tagVal++;
        }
        
        return tagVal - matchVal - matchVal - matchVal;
    }

    function indexOfMax(arr) {
        if (arr.length === 0) return -1;
        var max = arr[0];
        var maxIndex = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }
        return maxIndex;
    }

    const handleCreateFriend = async () => {
        try {
            if (auth == null || auth == undefined) return setNewChat(false);
            if (user == null || user == undefined) return setNewChat(false);
            if (contacts == null || contacts == undefined) return setNewChat(false);
            
            if (user.matches.length > 0){
                let um = user.matches[user.matches.length-1];
                let gc = await getConversationAsync(um);
                if (gc){
                    if (gc.last.message == "ADMIN_X10347C9SAK2NFIDBVWI_MSGTEST"){
                        await setDalert("Message your latest match first!");
                        return setNewChat(false);
                    }
                }
                
            }

            let friendlist = [];
            for(let fl = 0; fl < 10; fl++){
                await friendlist.push(contacts[Math.floor(Math.random() * contacts.length)]);
            }

            if (friendlist.length > 0){
                
                let matchAlgo = [];
                for(let i = 0; i < 5; i++){
                    await matchAlgo.push(algorithm(user.tags, friendlist[i].tags, friendlist[i].matches.length));
                }

                if (matchAlgo.length > 0){
                    let tagPriority;
                    tagPriority = indexOfMax(matchAlgo);

                    if (tagPriority == undefined || tagPriority == null) {
                        return setNewChat(false);
                    }
        
                    let friend = friendlist[tagPriority];
        
                    if (friend){
                        const conv = conversations.find((c) => c.friend.id == friend.id);
        
                        if (conv) {
                            // set conv als current conversation
                            dispatch({ type: "SET_CURRENT_CHAT", payload: conv });
                            localStorage.setItem("convId", JSON.stringify(conv.id));
                            setNewChat(false);
                        } else {
                            
                            const gayuser = await getUserAsync(user.id);
                            const gayfriend = await getUserAsync(friend.id);
                            

                            if (gayfriend && gayuser){

                                const res = await createConversationAsync(auth.id, friend.id);

                                if (res) {
                                    
                                    await updateMatchesAsync(user.id, res.id);
                                    await updateMatchesAsync(friend.id, res.id);

                                    await localStorage.setItem("convId", JSON.stringify(res.id));
                                    location.reload();
                                }
                            }

                            await setNewChat(false);
                        }
                    }
                }
                else return setNewChat(false);
            }
            await setTimeout(()=>setNewChat(false), 3000);
        } catch (error){
            console.error(error);
            setTimeout(()=>setNewChat(false), 1500);
            return setTimeout(()=>setDalert("Weird, I could not find anyone to match you with."), 1400);
        }
    }


    const handleSelectConversation = (conv) => {  
        if (conv == null) return;
        setOnProfile(false);
        dispatch({type:"SET_CURRENT_CHAT", payload: conv});
        localStorage.setItem("convId", JSON.stringify(conv.id));
        localStorage.setItem("prevConv", JSON.stringify(conv));
    }


    const handleLogout =async () => {
        await localStorage.setItem("prevConv", null);
        await localStorage.setItem("convId", null);
        await logoutAsync();
        dispatch(signOut());
    };


    const handleCloseChat = () => {
        dispatch({ type: "SET_CURRENT_CHAT", payload: null });
        localStorage.setItem("convId", null);
    }
    

    return (
    <div className='sidebar' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <Profile open={onProfile} setOpen={setOnProfile} setDalert={setDalert} />
        <Dialog open={dalert!=""?true:false} onClose={()=>setDalert("")}>
            <span style={{color:"black"}}>{dalert}</span>
        </Dialog>
        
        <div className='wrapper'>
            <div className='top'>
                <div style={{cursor:'pointer'}} onClick={()=>setOnProfile(true)}>
                    <Avatar
                        src={auth?.profile? auth.profile : ""}
                        height={50} width={50}
                    />
                </div>
                <span className='logo' title='Your anonymous username.'><b>{auth?.username}</b></span>
                <Friendr open={newChat}/>
                <div
                    title='Make a Friend!'
                    className={"app-icon"}
                    onClick={async ()=>{
                        await setNewChat((prev)=>!prev);
                        handleCloseChat();
                        handleCreateFriend();
                        // testgayporn();
                    }}>
                    <i className='fa-solid fa-plus'></i>
                </div>
            </div>
            <div className='center'>
                <div className='search-wrapper'>
                    <div className='input-wrapper'>
                        <i className='fa-solid fa-magnifying-glass'></i>
                        <input
                            onChange={handleSearch}
                            type='text'
                            placeholder={"Search a contact"}/>
                    </div>
                </div>
                <div className="center-wrapper">
                    <div className="items-wrapper">
                            {conversations.map((chat)=>(
                                <ChatItem
                                    chat={chat}
                                    active={chat?.id == currentChat?.id}
                                    selectConversation={handleSelectConversation}
                                    key={chat?.id}
                                />
                            ))}
                        </div>
                </div>
            </div>
            <div className='bottom'>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className='fa-solid fa-power-off'></i>Logout
                </button>
                <div className='info-btn'>
                    <button title='Contact Support' className='btn' onClick={()=>{
                        window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform?usp=pp_url&entry.1128661337=${auth?.id}&entry.379855328=${currentChat?.id}&entry.1414077091=${auth?.id}&entry.481005644=${auth?.id}`, "_blank")
                    }}>
                        <i className='fa-solid fa-headset'/>
                    </button>
                    <button title='Information' className='btn' onClick={()=>{
                        window.open("https://lenicon.gitbook.io/friend.ly/", "_blank")
                    }}>
                        <i className='fa-solid fa-info-circle'/>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}
