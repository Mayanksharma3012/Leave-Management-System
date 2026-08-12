import './header.css'


function Navbar({active}) {

    const userName = 'Mayank Sharma'

    return (
        <header className="topNavbar card">

            <div className="greeting">
                <div className="greetingText">
                    {active === 'Dashboard' ? (
                        <>
                            <div className="muted">Welcome back,</div>
                            <h1 className="welcomeName">{userName}</h1>
                        </>
                    ) : active === 'Apply Leave' ? (
                        <>
                            <h1 className="applyHeading">Apply for leave</h1>
                            <p className="applyInfo">Complete your request and submit it quickly for approval.</p>
                        </>
                    ) : (
                        <>
                            <h1 className="applyHeading">Welcome</h1>
                            <p className="applyInfo">Use the sidebar to navigate through your dashboard and requests.</p>
                        </>
                    )}
                </div>
                <div className="navActions">
                    <button className="iconBtn" aria-label="Notifications">🔔</button>
                    <button className="avatarBtn" aria-label="Profile">M</button>
                </div>
            </div>
        </header>

    )
}

export default Navbar