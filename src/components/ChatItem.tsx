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
  
  switch (true) {
    case (chat?.last?.message == "XXCONVO_FIRSTMESSAGEXX"):
      lastMessage = `Say hi! to ${chat?.friend?.username}`;
      break;
    
    case (chat?.last?.message?.includes("XXMSGPHOTOPROCESSSENDXX")):
        
        let r = chat?.last?.message?.split("__", 3);
        lastMessage = `${ (r[1] == chat?.friend?.id) ? (!revealed? chat?.friend?.username: chat?.friend?.fname) : "You"} sent ${ (r[2]>1) ? `${r[2]} photos`:"a photo" }.`;

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
                    {(chat?.last?.message != "XXCONVO_FIRSTMESSAGEXX") ? format(chat?.last?.createdAt?.toDate()):""}
                  </span>
                )}
            </div>
            {revealed? (<span className='username nick'>{chat?.friend?.username}</span>):(<></>)}
            <p className='last-message'>{lastMessage}</p>
        </div>
    </div>
    
  )
}
