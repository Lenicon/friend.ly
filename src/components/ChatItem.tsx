import {useEffect, useState} from 'react';
import Avatar from './Avatar';

import {format} from 'timeago.js';
import { getConversationAsync } from '../services/chatServices';

export default function ChatItem({chat, active, selectConversation}) {
  
  const [revealed, setRevealed] = useState(false);

  useEffect(()=>{
      // loadFriendInfo();
  }, [chat, revealed])

  const loadFriendInfo = async () =>{
      const conv = await getConversationAsync(chat?.id);
      if (conv){
          if(chat?.friend?.id in conv?.revealed){
              return setRevealed(true);
          }
      }
  }

  let lastMessage = "";
  if (chat?.last?.createdAt) {
    lastMessage = chat?.last?.message ? chat.last.message : "...";
  } else {
    lastMessage = `Say hi! to ${chat?.friend?.username}`;
  }

  
  return (
    
    <div className={active ? "chat-item active" : 'chat-item'} onClick={()=>selectConversation(chat)}>
        <Avatar
          src={!revealed? (chat?.friend?.uProfile ? chat.friend.uProfile : "") : (chat?.friend?.profile? chat?.friend.profile.url: "")}
          height={55} width={55}/>
        <div className='chat-item-infos'>
            <div className = 'avatar-infos'>
                <span className='username'>{!revealed? (chat?.friend?.username):(`${chat?.friend?.fname} ${chat?.friend?.lname}`)}</span>
                {chat?.last?.createdAt && (
                  <span className='timeline'>
                    {format(chat?.last?.createdAt?.toDate())}
                  </span>
                )}
            </div>
            <p className='last-message'>{lastMessage}</p>
        </div>
    </div>
    
  )
}
