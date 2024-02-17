

import NavBar from '../components/NavBar'
import '../assets/css/home.css'
import { useState, useEffect } from 'react'

export default function Home() {
    const [active, setActive] = useState(false);
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 1000px)");
        const onChange = () => setIsWide(!!mql.matches);

        mql.addEventListener("change", onChange)

        return () => mql.removeEventListener("change", onChange);
    }, [window.matchMedia]);

    return (
        <div className='home'>
            <div className='wrapper'>
                <NavBar active={active} setActive={setActive} />
                <div className={active ? 'home-content active':'home-content'}>
                    <header>
                        <h1>Unmask Friendships</h1>
                        <p>Hidden identities open the door to surprising conversations,{isWide ? (<br />) : " "}where true connections bloom organically.</p>

                        <div className='buttons'>
                            <a href='/login' className='button primary'>LOGIN</a>
                            <a href='/register' className='button secondary'>REGISTER</a>
                        </div>
                    </header>

                    <footer>
                        &copy; 2024 - Friend.ly
                    </footer>
                </div>
            </div>
        </div>

    )
}
