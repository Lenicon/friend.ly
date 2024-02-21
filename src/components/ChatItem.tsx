import {useEffect, useState} from 'react';
import Avatar from './Avatar';

import {format} from 'timeago.js';

export default function ChatItem({chat, active, selectConversation}) {
  
  const [revealed, setRevealed] = useState(false);

  useEffect(()=>{
      loadFriendRevealInfo();
  }, [chat?.revealed])

  const loadFriendRevealInfo = async () =>{
    if (chat?.revealed.includes(chat?.friend?.id)){
        return setRevealed(true);
    } else return setRevealed(false);
  }

  let lastMessage = "";
  switch (chat?.last?.message) {
    case "ADMIN_X10347C9SAK2NFIDBVWI_MSGTEST":
      lastMessage = `Say hi! to ${chat?.friend?.username}`;
      break;
    
    case (chat?.last?.message.includes("MSGPHOTOPROCESSSENDX12345X_")):
        if (chat?.last?.message == `MSGPHOTOPROCESSSENDX12345X_${chat?.friend?.id}`) lastMessage = `${!revealed? chat?.friend?.username: chat?.friend?.fname} sent a photo.`;
        else lastMessage = "You sent a photo.";

      break;

    default:
      lastMessage = chat?.last?.message ? chat?.last?.message: "...";

      break;
  }

  
  return (
    
    <div className={active ? "chat-item active" : 'chat-item'} onClick={()=>selectConversation(chat)}>
        <Avatar
          src={!revealed? (chat?.friend?.uProfile ? chat.friend.uProfile : "") : (chat?.friend?.profile? chat?.friend.profile: "")}
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
            {revealed? (<span className='username nick'>{chat?.friend?.username}</span>):(<></>)}
            <p className='last-message'>{lastMessage}</p>
        </div>
    </div>
    
  )
}
