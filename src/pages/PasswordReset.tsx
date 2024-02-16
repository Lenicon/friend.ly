import {useState} from 'react';
import '../assets/css/passwordReset.css';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Dialog from '../components/Dialog';
import { checkUserExistByEmail } from '../services/chatServices';

export default function PasswordReset() {
    const [error, setError] = useState("");
    const [dalert, setDalert] = useState("");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const auth = getAuth();

    const triggerResetEmail = async() => {
        try{
            setError("");
            await sendPasswordResetEmail(auth, email);
            await setDalert("Password reset link sent! It should arrive in your inbox within 5 minutes. If you haven't received it after checking both inbox and spam, you can request another link here.")
            await setLoading(false);
        } catch (error){
            const c = error.code;
            if (c == "auth/missing-email") return setError("Email does not exist.");
            else return setError(error.code);
        }
    }

    const handleSubmit = async()=>{
        if (email == "") return setError("Please input your email.");
        if (!email.match("^[0-9]+@usc\.edu\.ph")) return setError("Incorrect email format.");

        const res = await checkUserExistByEmail(email)

        if (res) {
            setLoading(true);
            await triggerResetEmail();
        } else {
            return setError("Email does not exist.")
        }
        

    }
    

  return (
    <div className='passres'>
        <Dialog open={dalert!=""?true:false} onClose={()=>setDalert("")}>
            {dalert}
        </Dialog>
        <div className='wrapper'>
            <h2 className='heading'>Password Reset</h2>
            
            <form id='passwordResForm' className='form'>
                {error && <span className='error-msg'>{error}</span>}
                <label className='label-resemail'>To reset your password, enter the email address linked to your account and we'll send you a secure link.</label>
                
                <input aria-label='resemail' onChange={(p)=>setEmail(p.target.value)} value={email} type='email' className='resemail' placeholder='USC Email' required/>
                <hr/>
                
                <button type='button' disabled={loading} className='submitbtn' onClick={handleSubmit}>Reset Password</button>
            
                <span className="link">
                    <a href='/login'>Remember your password? Login here.</a>
                </span>
            
            </form>
            
        </div>
    </div>
  )
}
