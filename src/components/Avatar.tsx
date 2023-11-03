import defAvatar from "../assets/img/defaultAvatar.jpg"
import '../assets/css/avatar.css';

type avatar = {
  id ?: string,
  username ?: string,
  fname?:string,
  lname?:string,
  src ?: any,
  realSrc ?: any,
  revealed?:boolean,
  height ?: number,
  width ?: number
}

export default function Avatar({id, username, fname,lname, src, realSrc, height, width}: avatar) {
  
  /* add this feature next time
        {<div className='avatar-img'>
        <img src={revealed? (realSrc? realSrc: defAvatar) : (src? src : defAvatar)} alt="" style={{
          height: `${height}px`,
          width: `${width}px`,
          objectFit: `cover`,
          borderRadius: `0.5rem`,
        }}
        />
        </div>

        {id && (
          <span style={{fontSize:"1rem"}} className='idn'>
            {revealed? (id ? id : "00000000"):""}
          </span>
        )}      
        
        {username && (
          <span style={{ fontSize:"1rem" }} className='usern'>
            {revealed? (fname&&lname? fname+" "+lname : username) :(username ? username : "John Doe")}    
          </span>
        )}}
        */
  
  return (
    <div className='d-flex-row'>

      <div className='avatar-img'>
        <img
          src={src? src : defAvatar}
          alt="" style={{
            height: `${height}px`,
            width: `${width}px`,
            objectFit: `cover`,
            borderRadius: `0.5rem`,
          }}
        />
        </div>

        {id && (
          <span style={{fontSize:"1rem"}} className='idn'>
            {id ? "" : ""}
          </span>
        )}      
        
        {username && (
          <span style={{ fontSize:"1rem" }} className='usern'>
            {username ? username : "John Doe"}
          </span>
        )}
    </div>
  )
}
