

import NavBar from '../components/NavBar'
import '../assets/css/home.css'
import { useState } from 'react'

export default function Home() {
    const [active, setActive] = useState(false);

    return (
        <div>
            <NavBar active={active} setActive={setActive}/>
            <div className='home' onClick={()=>setActive(false)}>
                    <h1>Unmask Friendships</h1>
                    <p>Hidden identities open the door to surprising conversations,{!active?(<br/>):" "}where true connections bloom organically.</p>
                
                <div className='buttons'>
                    <a href='/login' className='button primary'>LOGIN</a>
                    <a href='/register' className='button secondary'>REGISTER</a>
                </div>

                <footer>
                    &copy; 2024 - Friend.ly
                </footer>
            </div>
        </div>

    )
}
