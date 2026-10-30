import './header.css'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/userContext.js'

function Navbar() {
    const location = useLocation()
    const context = useContext(userContext)
    const user = context?.userData
    const isManager = location.pathname.startsWith('/manager/')
    const [profileDetails, setProfileDetails] = useState({
        userName: user?.userName || '',
        email: user?.email || '',
        avatar_url: user?.avatar_url || ''
    })

    useEffect(() => {
        let isMounted = true

        const fetchProfileDetails = async () => {
            try {
                const endpoint = isManager
                    ? `${import.meta.env.VITE_BACKEND_URL}/manager/details`
                    : `${import.meta.env.VITE_BACKEND_URL}/user/me`
                const response = await axios.get(endpoint, { withCredentials: true })
                const profile = response.data?.user

                if (isMounted && profile) {
                    setProfileDetails(profile)
                }
            } catch (error) {
                console.error(`Unable to load ${isManager ? 'manager' : 'employee'} profile:`, error)
            }
        }

        fetchProfileDetails()
        return () => {
            isMounted = false
        }
    }, [isManager])

    const displayName = profileDetails.userName || user?.userName || user?.email || 'User'
    const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    const avatarUrl = profileDetails.avatar_url || user?.avatar_url
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
        },
        '/manager/dashboard': {
            title: `Welcome back, ${userName || 'manager'}`,
            subtitle:"Here's your team's leave overview."
            
        },
        '/manager/leave-requests': {
            title: 'Leave Requests',
            subtitle: "Review and manage your team's leave applications."
        },
        '/manager/team': {
            title: 'My Team',
            subtitle: "Manage your team members and view their leave information."
        },
        '/manager/calendar': {
            title: 'Team Calendar',
            subtitle: "View your team's leave schedule and plan work accordingly."
        },
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
                        aria-label={`${displayName} profile`}
                        title={displayName}
                    >
                        {avatarUrl
                            ? <img src={avatarUrl} alt="" />
                            : initials}
                    </button>

                </div>

            </div>

        </header>
    )
}

export default Navbar