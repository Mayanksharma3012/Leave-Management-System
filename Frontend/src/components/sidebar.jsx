import './sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'


function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    useEffect(() => {
        if (!isOpen) return undefined
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [isOpen])
    const navigate = useNavigate()
    const isManager = location.pathname.startsWith('/manager')
    const links = isManager
        ? [
            { label: 'Dashboard', to: '/manager/dashboard' },
            { label: 'Leave Requests', to: '/manager/leave-requests' },
            { label: 'My Team', to: '/manager/team' },
            { label: 'Calendar', to: '/manager/calendar' },
            { label: 'Settings', to: '/manager/settings' },
        ]
        : [
            { label: 'Dashboard', to: '/employee/dashboard' },
            { label: 'Apply Leave', to: '/employee/apply-leave' },
            { label: 'My Leaves', to: '/employee/my-leaves' },
            { label: 'Calendar', to: '/employee/calendar' },
            { label: 'Settings', to: '/employee/settings' },
        ]

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
                withCredentials: true,  // ← equivalent to credentials: 'include'
            });
    
            navigate('/')
        } catch (error) {
            console.log('unable to logout, error:', error)
        }
    }

    return (
        <>
            <button
                type="button"
                className="mobileSidebarToggle"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(true)}
            >
                <span></span><span></span><span></span>
            </button>
            {isOpen && <button type="button" className="sidebarBackdrop" aria-label="Close navigation menu" onClick={() => setIsOpen(false)} />}
            <div className={`sidebar${isOpen ? ' sidebarOpen' : ''}`}>

            <button type="button" className="sidebarClose" aria-label="Close navigation menu" onClick={() => setIsOpen(false)}>&times;</button>

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
                {links.map(({ label, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={label === 'Dashboard'}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>


            <div className="sidebarLogOut">
                <button onClick={handleLogout}>Logout</button>
            </div>
            </div>
        </>
    )
}

export default Sidebar