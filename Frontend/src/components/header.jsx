import './header.css'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { userContext } from '../context/userContext.js'

function Navbar() {

    const location = useLocation()
    const user = useContext(userContext);
    const userName = user?.userName || user?.email || 'there'

    const pageInfo = {
        '/employee/dashboard': {
            title: `Welcome back, ${userName}`,
            subtitle: 'Here’s an overview of your leave activity.'
        },

        '/employee/apply-leave': {
            title: 'Apply for leave',
            subtitle: 'Complete your request and submit it quickly for approval.'
        },

        '/employee/my-leaves': {
            title: 'My Leaves',
            subtitle: 'View and manage your leave requests.'
        },

        '/employee/calendar': {
            title: 'Leave Calendar',
            subtitle: 'Track your leaves, holidays and upcoming time off.'
        },

        '/employee/settings': {
            title: 'Settings',
            subtitle: 'Manage your account and application preferences.'
        }
    }

    const currentPage = pageInfo[location.pathname] || {
        title: 'Welcome',
        subtitle: 'Use the sidebar to navigate through your dashboard and requests.'
    }

    return (
        <header className="topNavbar card">

            <div className="greeting">

                <div className="greetingText">

                    <h1 className="applyHeading">
                        {currentPage.title}
                    </h1>

                    <p className="applyInfo">
                        {currentPage.subtitle}
                    </p>

                </div>


                <div className="navActions">

                    <button
                        className="iconBtn"
                        aria-label="Notifications"
                    >
                        🔔
                    </button>

                    <button
                        className="avatarBtn"
                        aria-label="Profile"
                    >
                        M
                    </button>

                </div>

            </div>

        </header>
    )
}

export default Navbar