import './sidebar.css'
import { useState } from 'react'
function Sidebar({active, setActive}){

    // const [active, setActive] = useState('')

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
                <a href="#" className={(active === 'Dashboard' || '')? 'active':''} onClick={()=> setActive('Dashboard')}>Dashboard</a>
                <a href="#" className={active==='Apply Leave'? 'active':''} onClick={()=> setActive('Apply Leave')}>Apply Leave</a>
                <a href="#" className={active==='My Leaves'? 'active':''} onClick={()=> setActive('My Leaves')}>My Leaves</a>
                <a href="#" className={active==='Calendar'? 'active':''} onClick={()=> setActive('Calendar')}>Calendar</a>
                <a href="#" className={active==='Settings'? 'active':''} onClick={()=> setActive('Settings')}>Settings</a>
            </nav>

            <div className="sidebarLogOut">
                <button>Logout</button>
            </div>
        </div>
    )
}

export default Sidebar