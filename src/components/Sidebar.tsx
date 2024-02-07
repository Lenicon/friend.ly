import {useContext, useEffect, useState} from 'react';
import "../assets/css/sidebar.css";

import Avatar from './Avatar';
import ChatItem from './ChatItem';
import ContactItem from './ContactItem';
import Profile from './Profile';
import { logoutAsync } from '../services/authServices';
import { Context } from '../context/Context';
import { signOut, updateMatches } from '../context/Actions';
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

// type Props = {
//     setChat: (chat: boolean) => void,
// }

export default function SideBar() {
    const { auth, user, users, dispatch, chats, currentChat } = useContext(Context);
    const [newChat, setNewChat] = useState(false);
    const [onProfile, setOnProfile] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState([]);

    /*
        This is the add conversation feature.
        right now it's just like messenger's where you can add any user into your convo.
        Change this later to go to the finder page whenever they click the plus button.
        The users they match with will then be random
        
        THIS IS JUST A TEST FOR NOW, DONT FORGET
        vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    */
    // let contacts = users;

    useEffect(()=>{
        users && setContacts(users);
        chats && setConversations(chats);
    }, [users, chats]);

    const handleSearch=(e)=>{
        const toSearch = e.target.value;
        if(newChat) {
            //start new convo
            if(toSearch){
                // contacts =users.filter((usr)=>usr.username.toLowerCase().includes(toSearch.toLowerCase()));
                setContacts(
                    users.filter((usr)=>
                        usr.username.toLowerCase().includes(toSearch.toLowerCase())
                    )
                );
            } else {
                // contacts = users;
                setContacts(users)
            }
        } else {
            //search conversations
            if (toSearch) {
                setConversations(
                    chats.filter((chat) =>
                        chat.friend.username.toLowerCase().includes(toSearch.toLowerCase())
                    )
                )
            } else {
                setConversations(chats);
            }
        }
    }

    /*
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        This is the add conversation feature.
        right now it's just like messenger's where you can add any user into your convo.
        Change this later to go to the finder page whenever they click the plus button.
        The users they match with will then be random
        
        THIS IS JUST A TEST FOR NOW, DONT FORGET
    */

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

    // const handleCreateConversation = async (friendId) => {
        
    //     if (auth == null) return;
    //     // check if conversation exists
    //     const conv = conversations.find((c) => c.friend.id == friendId);
        
    //     if (conv) {
    //       // set conv als current conversation
    //       dispatch({ type: "SET_CURRENT_CHAT", payload: conv });
    //       localStorage.setItem("convId", JSON.stringify(conv.id));
    //       setNewChat(false);
    //     } else {
    //       // let's create first a conversation
    //       const res = await createConversationAsync(auth.id, friendId);
    //       if (res) {
    //         localStorage.setItem("convId", JSON.stringify(res.id));
    //         setNewChat(false);
    //       }
    //     }
    // };

    function algorithm(tagArrA, tagArrB, matchVal) {
        var tagVal = 1;
        for (let i=0; i<tagArrA.length; i++) {
            if (tagArrB.indexOf(tagArrA[i]) != -1)
                tagVal++;
        }
        console.log("algoVal ", tagVal- matchVal - matchVal - matchVal);
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

    // const checkMatch = async () => {
        
    // }

    const handleCreateFriend = async () => {
        if (auth == null || auth == undefined) return setNewChat(false);
        if (user == null || user == undefined) return setNewChat(false);
        if (contacts == null || contacts == undefined) return setNewChat(false);
        
        if (user.matches.length > 0){
            let um = user.matches[user.matches.length-1];
            let gc = await getConversationAsync(um);
            if (gc){
                if (gc.last.createdAt == null || gc.last.createdAt == undefined){
                    await alert("Message your match!");
                    return setNewChat(false);
                }
            }
            
        }

        let friendlist = [];
        for(let fl = 0; fl < 5; fl++){
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
    }


    const handleSelectConversation = (conv) => {  
        dispatch({type:"SET_CURRENT_CHAT", payload: conv});
        localStorage.setItem("convId", JSON.stringify(conv.id));
    }


    const handleLogout =async () => {
        await logoutAsync();
        dispatch(signOut());
    };


    const handleCloseChat = () => {
        dispatch({ type: "SET_CURRENT_CHAT", payload: null });
        localStorage.setItem("convId", null);
    }
    

    return (
    <div className='sidebar'>
        <Profile open={onProfile} setOpen={setOnProfile} />
        
        <div className='wrapper'>
            <div className='top'>
                <div style={{cursor:'pointer'}} onClick={()=>setOnProfile(true)}>
                    <Avatar
                        src={auth?.profile? auth.profile : ""}
                        height={50} width={50}
                    />
                </div>
                <span className='logo'><b>YOU: {auth?.username}</b></span>
                {newChat && <Friendr/>}
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
                        window.open(`https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform?usp=pp_url&entry.1128661337=${auth.id}&entry.379855328=${currentChat.id}&entry.1414077091=${auth.id}&entry.481005644=${auth.id}`, "_blank")
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
