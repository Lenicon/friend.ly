import React from 'react';
import Avatar from './Avatar';

export default function ContactItem({contact, createConversation}) {
  return (
    <div
      onClick={()=>createConversation(contact?.id)}
      className='contact-item'
    >
        <Avatar
          src={contact?.uProfile? contact.uProfile : ""}
          height={55} width={55}
          username={contact?.username} />
    </div>
  )
}
