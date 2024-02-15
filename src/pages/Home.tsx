import NavBar from '../components/NavBar'

import '../assets/css/home.css'

export default function Home() {

    return (
        <div>
            <NavBar />
            <div className='home'>
                    <h1>Unmask Friendships</h1>
                    <p>Hidden identities open the door to surprising conversations,<br/>where true connections bloom organically.</p>
                
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
