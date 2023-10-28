import React from 'react'
import '../assets/css/message.css'

type message = {
  owner : boolean,
  msg : any,
  openImageViewer : any
}

export default function Message({owner, msg, openImageViewer}:message) {
  return (
    <div className={owner ? "message owner":"message"}>
      <div className='message-wrapper'>
        {msg?.images.length > 0 && (
          <div className='image-wrapper' onClick={() => openImageViewer(msg.images)}>
            <img src={msg?.images[0]} alt='' />
            {msg?.images.length > 1 &&
              <div className="image-count">+{msg?.images.length - 1}</div>
            }
          </div>
        )}
        <p>{msg?.message}</p>
      </div>
      <span className='timeline'>just now</span>
    </div>
  )
}
