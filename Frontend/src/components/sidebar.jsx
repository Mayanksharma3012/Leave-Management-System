import './sidebar.css'

function Sidebar(){
    return(
        <div className="sidebar">
            <div className="toplogo">     
                <div className="logo" aria-hidden></div>
                <div className="brand-text">
                    <h1 className="name">LeaveManager</h1>
                    <p className="tagline">Smart leave approval for modern teams</p>
                </div>
            </div>

            <nav className="sidebarLinks" aria-label="Main navigation">
                <a href="#" className="active">Dashboard</a>
                <a href="#">Apply Leave</a>
                <a href="#">My Leaves</a>
                <a href="#">Calendar</a>
                <a href="#">Settings</a>
            </nav>

            <div className="sidebarLogOut">
                <button>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar