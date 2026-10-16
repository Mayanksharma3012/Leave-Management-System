import { useContext, useState } from 'react'
import axios from 'axios'
import Sidebar from '../../components/sidebar.jsx'
import { userContext } from '../../context/userContext.js'
import './settings.manager.css'

const settingsTabs = [
    { id: 'Profile', label: '👤 Profile' },
    { id: 'Security', label: '🔒 Security' },
    { id: 'Notifications', label: '🔔 Notifications' },
    { id: 'Appearance', label: '🎨 Appearance' },
]

const themeOptions = [
    { id: 'light', label: 'Light', caption: 'Use the standard day mode.', icon: '☀️' },
    { id: 'dark', label: 'Dark', caption: 'Switch the dashboard to dark mode.', icon: '🌙' },
    { id: 'system', label: 'System', caption: 'Match your device preference automatically.', icon: '🖥️' },
]

const notificationOptions = [
    { id: 'newRequests', label: 'New leave requests', description: 'Notify me when an employee submits a leave request.' },
    { id: 'teamDecisions', label: 'Team leave decisions', description: 'Notify me when a leave request is approved or rejected.' },
    { id: 'upcomingAbsences', label: 'Upcoming team absences', description: 'Remind me about approved leave in my team.' },
    { id: 'announcements', label: 'Company announcements', description: 'Receive important company-wide updates.' },
]

export default function ManagerSettingPage({ theme, setTheme }) {
    const user = useContext(userContext)
    const [activeTab, setActiveTab] = useState('Profile')
    const [changePassword, setChangePassword] = useState(false)
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [notifications, setNotifications] = useState({
        newRequests: true,
        teamDecisions: true,
        upcomingAbsences: false,
        announcements: true,
    })

    const managerName = user?.userName || 'Manager'
    const initials = managerName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

    const handlePasswordChange = async (event) => {
        event.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')

        if (password.newPassword !== password.confirmPassword) {
            setPasswordError('New password and confirmation do not match.')
            return
        }
        if (password.newPassword === password.currentPassword) {
            setPasswordError('New password and current password cannot be the same.')
            return
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/change-password`,
                password,
                { withCredentials: true }
            )
            setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setChangePassword(false)
            setPasswordSuccess('Your password has been updated.')
        } catch (error) {
            setPasswordError(error.response?.data?.message || 'Unable to update your password. Please try again.')
        }
    }

    const toggleNotification = (id) => {
        setNotifications((current) => ({ ...current, [id]: !current[id] }))
    }

    return (
        <div className="managerSettingsPage">
            <Sidebar />

            <main className="managerSettingsMain container">
                <section className="settingsMain">
                    <header className="settingsHeader">
                        <div>
                            <p className="settingsEyebrow">Manager account</p>
                            <h1>Settings</h1>
                            <p className="settingsSubtitle">Manage your manager profile and workspace preferences.</p>
                        </div>
                        <div className="settingsHeaderActions">
                            <button type="button" className="iconAction" aria-label="Notifications">🔔</button>
                            <div className="managerSettingsAvatar" aria-label={`${managerName} profile`}>{initials}</div>
                        </div>
                    </header>

                    <div className="settingsPanel">
                        <aside className="settingsSidebar">
                            <h2>Manager settings</h2>
                            <nav className="settingsNav" aria-label="Manager settings navigation">
                                {settingsTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        className={`settingsTab ${activeTab === tab.id ? 'active' : ''}`}
                                        aria-current={activeTab === tab.id ? 'page' : undefined}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        <div className="settingsContent">
                            {activeTab === 'Profile' && (
                                <section className="settingsSection" aria-labelledby="manager-profile-heading">
                                    <div className="sectionHeadingRow">
                                        <h2 id="manager-profile-heading">Manager profile</h2>
                                    </div>
                                    <div className="profileCard">
                                        <div className="profilePhotoBlock">
                                            <div className="managerProfileAvatar" aria-hidden="true">{initials}</div>
                                            <strong className="managerProfileRole">Manager</strong>
                                            <span className="managerProfileCaption">Workspace administrator</span>
                                        </div>
                                        <div className="fieldGrid">
                                            <div className="fieldBlock">
                                                <label htmlFor="manager-name">Full name</label>
                                                <input id="manager-name" type="text" value={managerName} readOnly />
                                            </div>
                                            <div className="fieldBlock">
                                                <label htmlFor="manager-email">Email</label>
                                                <input id="manager-email" type="email" value={user?.email || ''} readOnly />
                                            </div>
                                            <div className="fieldBlock">
                                                <label htmlFor="manager-department">Department</label>
                                                <input id="manager-department" type="text" value={user?.department || 'Not specified'} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'Security' && (
                                <section className="settingsSection" aria-labelledby="manager-security-heading">
                                    <div className="sectionHeadingRow">
                                        <h2 id="manager-security-heading">Account security</h2>
                                    </div>
                                    {passwordSuccess && <p className="managerSettingsSuccess" role="status">{passwordSuccess}</p>}
                                    {!changePassword ? (
                                        <div className="securityCard">
                                            <div className="securityInfoRow">
                                                <div className="securityTextBlock">
                                                    <h3>Password</h3>
                                                    <span>Keep your manager account secure by updating your password regularly.</span>
                                                </div>
                                            </div>
                                            <div className="settingsActions securityAction">
                                                <button type="button" className="secondaryBtn" onClick={() => {
                                                    setPasswordError('')
                                                    setPasswordSuccess('')
                                                    setChangePassword(true)
                                                }}>
                                                    [ Change Password ]
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form className="changePasswordBlock" onSubmit={handlePasswordChange}>
                                            <div className="fieldGrid passwordGrid">
                                                <div className="fieldBlock">
                                                    <label htmlFor="manager-current-password">Current password</label>
                                                    <input
                                                        id="manager-current-password"
                                                        type="password"
                                                        autoComplete="current-password"
                                                        value={password.currentPassword}
                                                        onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="fieldBlock">
                                                    <label htmlFor="manager-new-password">New password</label>
                                                    <input
                                                        id="manager-new-password"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        value={password.newPassword}
                                                        onChange={(event) => setPassword({ ...password, newPassword: event.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="fieldBlock">
                                                    <label htmlFor="manager-confirm-password">Confirm new password</label>
                                                    <input
                                                        id="manager-confirm-password"
                                                        type="password"
                                                        autoComplete="new-password"
                                                        value={password.confirmPassword}
                                                        onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {passwordError && <p className="passwordError" role="alert">{passwordError}</p>}
                                            <div className="settingsActions securityAction">
                                                <button type="button" className="secondaryBtn" onClick={() => {
                                                    setChangePassword(false)
                                                    setPasswordError('')
                                                    setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                                }}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="primaryBtn">Update Password</button>
                                            </div>
                                        </form>
                                    )}
                                </section>
                            )}

                            {activeTab === 'Notifications' && (
                                <section className="settingsSection" aria-labelledby="manager-notifications-heading">
                                    <div className="sectionHeadingRow">
                                        <h2 id="manager-notifications-heading">Team notifications</h2>
                                    </div>
                                    <div className="notificationCard">
                                        <div className="notificationGroup">
                                            <h3>Leave management</h3>
                                            {notificationOptions.map((option) => (
                                                <div className="notificationRow" key={option.id}>
                                                    <div className="notificationText">
                                                        <label htmlFor={`manager-notification-${option.id}`}>{option.label}</label>
                                                        <span>{option.description}</span>
                                                    </div>
                                                    <button
                                                        id={`manager-notification-${option.id}`}
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={notifications[option.id]}
                                                        className={`switch ${notifications[option.id] ? 'on' : ''}`}
                                                        aria-label={`${notifications[option.id] ? 'Turn off' : 'Turn on'} ${option.label.toLowerCase()}`}
                                                        onClick={() => toggleNotification(option.id)}
                                                    >
                                                        <span className="switchThumb" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activeTab === 'Appearance' && (
                                <section className="settingsSection" aria-labelledby="manager-appearance-heading">
                                    <div className="sectionHeadingRow">
                                        <h2 id="manager-appearance-heading">Workspace appearance</h2>
                                    </div>
                                    <div className="appearanceOptions">
                                        {themeOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className={`themeOption ${theme === option.id ? 'selected' : ''}`}
                                                aria-pressed={theme === option.id}
                                                onClick={() => setTheme(option.id)}
                                            >
                                                <span className="themeIcon" aria-hidden="true">{option.icon}</span>
                                                <span className="themeText">
                                                    <strong>{option.label}</strong>
                                                    <small>{option.caption}</small>
                                                </span>
                                                <span className={`themeRadio ${theme === option.id ? 'checked' : ''}`} aria-hidden="true" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
