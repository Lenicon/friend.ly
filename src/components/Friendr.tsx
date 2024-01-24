import { useState } from 'react';
import '../assets/css/friendr.css'

export default function Friendr() {
  return (
    <div className='friendr'>
      <div className='wrapper'>
        
        {/* <div className='content'> */}
          <div className='rotate'><i className='fa-solid fa-spinner'></i></div>
          Finding Friend...
        {/* </div> */}
      </div>
    </div>
  )
}
