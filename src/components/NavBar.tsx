import '../assets/css/navBar.css'

export default function NavBar({active, setActive}) {
    
    return (
        <>
            <header>
                <nav className='nav'>
                    <a href="/" className="logo">
                        <img alt='logo' draggable={false} width={45} height={45} src='https://i.imgur.com/3RMVGzt.png' />
                        <span>Friend.ly</span>
                    </a>
                    <div>
                        <ul id='navbar' className={active ? "#navbar active" : "#navbar"}>
                            <li><a href="https://lenicon.gitbook.io/friend.ly/" target='_blank'>About</a></li>
                            <li><a  target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform">Support</a></li>
                            <li><a  target='_blank' href="https://lenicon.gitbook.io/friend.ly/help-and-tutorial">FAQ</a></li>
                            <li><a  target='_blank' href="https://lenicon.gitbook.io/friend.ly/terms-and-conditions">Terms</a></li>
                            <li><a  target='_blank' href="https://lenicon.gitbook.io/friend.ly/privacy-policy">Privacy</a></li>
                        </ul>
                    </div>

                    <div id="mobile" onClick={()=>setActive((prev) => !prev)}>
                        <i
                            id="bar"
                            className={active ? "fa-solid fa-times" : "fa-solid fa-bars"}
                        ></i>
                    </div>
                </nav>
            </header>
        </>
    )
}
