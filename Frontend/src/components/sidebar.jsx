import './sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Sidebar() {

    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
                withCredentials: true,  // ← equivalent to credentials: 'include'
            });
    
            navigate('/')
        } catch (error) {
            console.log('unable to logout, error:', error)
        }
    }

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


            <div className="sidebarLogOut" onClick={handleLogout}>
                <button>Logout</button>
            </div>

        </div>
    )
}

export default Sidebar