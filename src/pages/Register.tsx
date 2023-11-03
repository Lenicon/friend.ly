import { useRef, useState } from 'react'
import '../assets/css/register.css'
import { registerAsync } from '../services/authServices';
import { zodiacUsernames, zodiacAvatarURLs } from '../config/randConfig';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const fnameRef = useRef(null);
  const lnameRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const clearInputs = () => {
    if (emailRef?.current){
      emailRef.current.value = "";
    }
    if (passRef?.current){
      passRef.current.value = "";
    }
    if (fnameRef?.current){
      fnameRef.current.value = "";
    }
    if (lnameRef?.current){
      lnameRef.current.value = "";
    }
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    setLoading(true);

    let selectZodiacUsername = Math.floor(Math.random() * zodiacUsernames.length);
    let selectRndNum = Math.floor(10000 + Math.random() * 90000);
    
    let selection = [selectZodiacUsername, selectRndNum];
    const creds = {
      username: zodiacUsernames[selection[0]]+"_"+selection[1],
      uProfile: zodiacAvatarURLs[selection[0]],
      fname: fnameRef.current.value,
      lname: lnameRef.current.value,
      uscID: emailRef.current.value.replace("@usc.edu.ph", ""),
      email: emailRef.current.value,
      password: passRef.current.value,
      isAdmin: false,

    };

    try {
      await registerAsync(creds);
      clearInputs();
      setLoading(false);
      navigate("/login");
    } catch(error) {
      const message = error.code;
      setError(message);
      setLoading(false);
    }

    
  };

  return (
    <div className='register'>
      <div className='wrapper'>
        <h2 className='heading'>Register</h2>
        <form onSubmit={handleSubmit} className='form'>
          {error && <span className='error-msg'>{error}</span>}
          <input required ref={fnameRef} id='fname' type='text' placeholder='First Name'/>
          <input required ref={lnameRef} id='lname' type='text' placeholder='Last Name'/>
          <input required ref={emailRef} pattern='^[0-9]+@usc\.edu\.ph' id="email" type='email' placeholder='USC Email'/>
          <input required ref={passRef} id="password" type='password' placeholder='Password'/>
          <button disabled={loading} type='submit'>
            {loading ? "Loading..." : "Register"}
          </button>
          <span className="link">
            <a href='/login'>Already got an account? Login here.</a>
          </span>
        </form>
      </div>
    </div>
  )
}
