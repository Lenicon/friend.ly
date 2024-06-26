import { useContext, useRef, useState } from 'react';
import '../assets/css/login.css'
import { loginAsync } from '../services/authServices';
import { getUserAsync } from "../services/chatServices";
import { Context } from '../context/Context';
import { signIn } from '../context/Actions';

import logoimg from '/logo.png';

export default function Login() {
  const { dispatch } = useContext(Context);
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearInputs = () => {
    if (emailRef?.current) {
      emailRef.current.value = "";
    }
    if (passRef?.current) {
      passRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const creds = {
      email: emailRef.current.value,
      password: passRef.current.value,
      uscID: emailRef.current.value.replace("@usc.edu.ph", '')
    };

    try {
      const res = await loginAsync(creds);
      if (res?.user) {
        const currentUser = await getUserAsync(res.user.uid);
        if (currentUser) {
          dispatch(signIn({ auth: res.user, user: currentUser }));
          clearInputs();
          setLoading(false);
        }
      }
    } catch (error) {
      const message = error.code;
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className='login'>

      <a className='logo' href='/'>
        <img alt="logo" draggable={false} src={logoimg} width={30} height={30} />
        FRIEND.ly
      </a>

      <div className='wrapper'>
        <h2 className='heading'>Login</h2>
        <form id='loginForm' onSubmit={handleSubmit} className='form'>
          {error && <span className='error-msg'>{error}</span>}
          <input required ref={emailRef} pattern='^[0-9]+@usc\.edu\.ph' type='email' placeholder='USC Email' />
          <input
            required
            ref={passRef}
            type='password'
            placeholder='Password'
          />
          <button disabled={loading} type='submit'>
            {loading ? "Loading..." : "Login"}
          </button>
          <span className="link">
            <a href='/register'>No account? Register here.</a>
          </span>
          <span className="link">
            <a href='/passwordReset'>Forgot your password? Click here.</a>
          </span>
        </form>
      </div>
    </div>
  )
}
