import './sidebar.css'
import { NavLink } from 'react-router-dom'

function Sidebar() {

    return (
        <div className="sidebar">

            <div className="toplogo">
                <div className="logo" aria-hidden></div>

                <div className="brand-text">
                    <h1 className="name">LeaveManager</h1>
                    <p className="tagline">
                        Smart leave approval for modern teams
                    </p>
                </div>
            </div>


            <nav className="sidebarLinks" aria-label="Main navigation">

                <NavLink
                    to="/employee/dashboard"
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                >
                    Dashboard
                </NavLink>


                <NavLink
                    to="/employee/apply-leave"
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                >
                    Apply Leave
                </NavLink>


                <NavLink
                    to="/employee/my-leaves"
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                >
                    My Leaves
                </NavLink>


                <NavLink
                    to="/employee/calendar"
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                >
                    Calendar
                </NavLink>


                <NavLink
                    to="/employee/settings"
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                >
                    Settings
                </NavLink>

            </nav>


            <div className="sidebarLogOut">
                <button>Logout</button>
            </div>

        </div>
    )
}

export default Sidebar