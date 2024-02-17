import '../assets/css/navBar.css'

export default function NavBar({ active, setActive }) {

    return (
        <>
            <nav className='topnav'>
                {/* LOGO */}
                <a className='logo' href='/'>
                    <img alt="logo" draggable={false} src='https://i.imgur.com/3RMVGzt.png' width={30} height={30} />
                    FRIEND.ly
                </a>

                {/* NAVIGATION LIST */}
                <div className={active ? "navlist active" : "navlist"}>
                    <a target='_blank' href="https://lenicon.gitbook.io/friend.ly/">About</a>

                    <a target='_blank' href="https://docs.google.com/forms/d/e/1FAIpQLSdE7ip1J2syETXeVArVLzgobH5PdSnCKU6c-1qgbAbh49r8XQ/viewform">Support</a>

                    <a target='_blank' href="https://lenicon.gitbook.io/friend.ly/help-and-tutorial">FAQ</a>

                    <a target='_blank' href="https://lenicon.gitbook.io/friend.ly/terms-and-conditions">Terms</a>

                    <a target='_blank' href="https://lenicon.gitbook.io/friend.ly/privacy-policy">Privacy</a>
                </div>


                {/* NAVIGATION ICON */}
                <a className={active ? 'icon active' : 'icon'} onClick={() => setActive((prev) => !prev)}>
                    <i className={active ? 'fa-solid fa-times' : 'fa-solid fa-bars'} />
                </a>
            </nav>

        </>
    )
}
