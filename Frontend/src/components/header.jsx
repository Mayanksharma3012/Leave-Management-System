import './header.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { userContext } from '../context/userContext.js'

const defaultManagerNotificationPreferences = {
    newRequests: true,
    leaveChanges: true,
    upcomingAbsences: false,
    announcements: true,
}

const defaultEmployeeNotificationPreferences = {
    approvedReq: true,
    rejectedReq: true,
    pendingReq: false,
    companyAnnounce: true,
    upcomingRemainder: false,
}

const shouldShowNotification = (notification, preferences, isManager) => {
    const text = `${notification?.titleAndMessage?.title || ''} ${notification?.titleAndMessage?.message || ''}`.toLowerCase()

    if (isManager) {
        if (text.includes('announce')) return preferences.announcements
        if (text.includes('upcoming') || text.includes('absence') || text.includes('reminder')) return preferences.upcomingAbsences
        if (text.includes('request deleted') || text.includes('leave updated') || text.includes('edited') || text.includes('cancelled') || text.includes('canceled')) return preferences.leaveChanges
        if (text.includes('request') || text.includes('leave')) return preferences.newRequests
        return true
    }

    if (text.includes('announce')) return preferences.companyAnnounce
    if (text.includes('upcoming') || text.includes('reminder')) return preferences.upcomingRemainder
    if (text.includes('approved')) return preferences.approvedReq
    if (text.includes('rejected') || text.includes('declined')) return preferences.rejectedReq
    if (text.includes('pending')) return preferences.pendingReq
    return true
}

function Navbar({ notificationPreferences }) {
    const location = useLocation()
    const navigate = useNavigate()
    const context = useContext(userContext)
    const user = context?.userData || context
    const isManager = location.pathname.startsWith('/manager/')
    const [managerNotificationPreferences, setManagerNotificationPreferences] = useState(
        notificationPreferences || defaultManagerNotificationPreferences
    )
    const [employeeNotificationPreferences, setEmployeeNotificationPreferences] = useState(
        notificationPreferences || defaultEmployeeNotificationPreferences
    )
    const [profileDetails, setProfileDetails] = useState({
        userName: user?.userName || '',
        email: user?.email || '',
        avatar_url: user?.avatar_url || ''
    })
    const [notifications, setNotifications] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 480px)').matches)
    const [mobileDropdownPosition, setMobileDropdownPosition] = useState({ top: 72, maxHeight: 420 })
    const notificationBellRef = useRef(null)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 480px)')
        const updateMobile = () => setIsMobile(mediaQuery.matches)
        mediaQuery.addEventListener('change', updateMobile)
        return () => mediaQuery.removeEventListener('change', updateMobile)
    }, [])

    useEffect(() => {
        if (!notificationsOpen || !isMobile) return undefined

        const updatePosition = () => {
            const bellRect = notificationBellRef.current?.getBoundingClientRect()
            const viewportHeight = window.visualViewport?.height || window.innerHeight
            const viewportOffsetTop = window.visualViewport?.offsetTop || 0
            const bellBottom = bellRect ? bellRect.bottom - viewportOffsetTop : 68
            const top = Math.min(Math.max(bellBottom + 8, 8), viewportHeight - 120)
            setMobileDropdownPosition({
                top,
                maxHeight: Math.max(120, viewportHeight - top - 8)
            })
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('orientationchange', updatePosition)
        window.visualViewport?.addEventListener('resize', updatePosition)
        window.visualViewport?.addEventListener('scroll', updatePosition)
        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('orientationchange', updatePosition)
            window.visualViewport?.removeEventListener('resize', updatePosition)
            window.visualViewport?.removeEventListener('scroll', updatePosition)
        }
    }, [notificationsOpen, isMobile])

    useEffect(() => {
        let preferences = notificationPreferences

        if (!preferences) {
            const userId = user?._id || user?.id || user?.email
            const storageKey = isManager
                ? `managerNotificationPreferences:${userId || 'current'}`
                : `employeeNotificationPreferences:${userId || 'current'}`
            const defaults = isManager
                ? defaultManagerNotificationPreferences
                : defaultEmployeeNotificationPreferences

            try {
                const savedPreferences = JSON.parse(localStorage.getItem(storageKey))
                preferences = savedPreferences && typeof savedPreferences === 'object'
                    ? { ...defaults, ...savedPreferences }
                    : defaults
            } catch {
                preferences = defaults
            }
        }

        if (isManager) {
            setManagerNotificationPreferences(preferences || defaultManagerNotificationPreferences)
        } else {
            setEmployeeNotificationPreferences(preferences || defaultEmployeeNotificationPreferences)
        }
    }, [isManager, notificationPreferences, user?._id, user?.id, user?.email])

    useEffect(() => {
        const closeNotifications = (event) => {
            if (!event.target.closest('.notificationWrapper, .mobileNotificationDropdown')) setNotificationsOpen(false)
        }
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setNotificationsOpen(false)
        }
        document.addEventListener('pointerdown', closeNotifications)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('pointerdown', closeNotifications)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [])

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

    useEffect(() => {
        let isMounted = true
        const endpoint = isManager ? 'manager' : 'user'

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${endpoint}/notifications`,
                    { withCredentials: true }
                )
                if (isMounted) {
                    const preferences = isManager
                        ? managerNotificationPreferences
                        : employeeNotificationPreferences
                    const receivedNotifications = response.data?.notifications || []
                    setNotifications(receivedNotifications.filter((notification) =>
                        shouldShowNotification(notification, preferences, isManager)
                    ))
                }
            } catch (error) {
                console.error(`Unable to fetch ${isManager ? 'manager' : 'employee'} notifications:`, error)
            }
        }

        setNotifications([])
        fetchNotifications()
        return () => {
            isMounted = false
        }
    }, [isManager, managerNotificationPreferences, employeeNotificationPreferences])
    
    const markNotificationRead = async (notificationId) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/${isManager? 'manager' : 'user'}/notifications/${notificationId}/read`,
                {},
                { withCredentials: true }
            )
            setNotifications((current) => current.map((notification) =>
                notification._id === notificationId ? { ...notification, status: 'Read' } : notification
            ))
        } catch (error) {
            console.error('Unable to mark notification as read:', error)
        }
    }

    const markAllNotificationsRead = async () => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/${isManager? 'manager' : 'user'}/notifications/read-all`,
                {},
                { withCredentials: true }
            )
            setNotifications((current) => current.map((notification) => ({ ...notification, status: 'Read' })))
        } catch (error) {
            console.error('Unable to mark all notifications as read:', error)
        }
    }

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/${isManager? 'manager' : 'user'}/notifications/${notificationId}`,
                { withCredentials: true }
            )
            setNotifications((current) => current.filter((notification) => notification._id !== notificationId))
            setSelectedNotification((current) => current?._id === notificationId ? null : current)
        } catch (error) {
            console.error('Unable to delete notification:', error)
        }
    }

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/${isManager? 'manager' : 'user'}/notifications`,
                { withCredentials: true }
            )
            setNotifications([])
            setSelectedNotification(null)
        } catch (error) {
            console.error('Unable to delete all notifications:', error)
        }
    }

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
        '/manager/settings': {
            title: 'Manager account',
            subtitle: "Manage your manager profile and workspace preferences."
        }
    }

    const currentPage = pageInfo[location.pathname] || {
        title: 'Welcome',
        subtitle: 'Use the sidebar to navigate through your dashboard and requests.'
    }

    const notificationDropdown = (
        <div className={isMobile ? 'notificationDropdown mobileNotificationDropdown' : 'notificationDropdown'} role="region" aria-label="Notifications">
            <div className="notificationBulkActions">
                <button type="button" onClick={markAllNotificationsRead}>Read all</button>
                <button type="button" className="danger" onClick={deleteAllNotifications}>Delete all</button>
            </div>
            {notifications.length === 0 ? (
                <p className="notificationEmpty">No notifications available</p>
            ) : notifications.map((notification) => (
                <div
                    className={`notificationItem ${notification.status === 'UnRead' ? 'unread' : ''}`}
                    key={notification._id}
                >
                    <button
                        type="button"
                        className="notificationContent"
                        onClick={() => {
                            setSelectedNotification(notification)
                            markNotificationRead(notification._id)
                        }}
                    >
                        <strong>{notification.titleAndMessage?.title}</strong>
                        <span>{notification.titleAndMessage?.message}</span>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </button>
                    <div className="notificationActions">
                        <button
                            type="button"
                            disabled={notification.status === 'Read'}
                            onClick={() => markNotificationRead(notification._id)}
                        >Read</button>
                        <button
                            type="button"
                            className="danger"
                            onClick={() => deleteNotification(notification._id)}
                        >Delete</button>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <>
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

                    <div className={`notificationWrapper${notificationsOpen ? ' notificationsOpen' : ''}`}>
                        <button
                            ref={notificationBellRef}
                            type="button"
                            className="iconBtn notificationBell"
                            aria-label={`${notifications.length} notifications`}
                            aria-haspopup="true"
                            aria-expanded={notificationsOpen}
                            onClick={() => setNotificationsOpen((open) => !open)}
                        >
                            🔔
                            {notifications.some((notification) => notification.status === 'UnRead') && (
                                <span className="notificationBadge">
                                    {notifications.filter((notification) => notification.status === 'UnRead').length}
                                </span>
                            )}
                        </button>

                        {!isMobile && notificationDropdown}
                    </div>

                    <button
                        type="button"
                        className="avatarBtn"
                        aria-label={`${displayName} profile`}
                        title={displayName}
                        onClick={() => navigate(isManager ? '/manager/settings' : '/employee/settings')}
                    >
                        {avatarUrl
                            ? <img src={avatarUrl} alt="" />
                            : initials}
                    </button>

                </div>

            </div>

        </header>

        {isMobile && notificationsOpen && createPortal(
            <div
                className="mobileNotificationDropdown notificationDropdown notificationsOpen"
                role="region"
                aria-label="Notifications"
                style={{
                    top: `${mobileDropdownPosition.top}px`,
                    maxHeight: `${mobileDropdownPosition.maxHeight}px`
                }}
            >
                {notificationDropdown.props.children}
            </div>,
            document.body
        )}

        {selectedNotification && (
            <div className="notificationModalOverlay" role="presentation" onClick={() => setSelectedNotification(null)}>
                <section
                    className="notificationModal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="notification-modal-title"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="notificationModalClose"
                        aria-label="Close notification"
                        onClick={() => setSelectedNotification(null)}
                    >
                        ×
                    </button>
                    <h2 id="notification-modal-title">{selectedNotification.titleAndMessage?.title}</h2>
                    <p>{selectedNotification.titleAndMessage?.message}</p>
                    <small>{new Date(selectedNotification.createdAt).toLocaleString()}</small>
                </section>
            </div>
        )}
        </>
    )
}

export default Navbar