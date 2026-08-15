import './settings.employee.css'
import Sidebar from './../../components/sidebar.jsx'
import Navbar from '../../components/header.jsx'
import fakeProfile from './../../assets/fakeProfile.png'
import { useState } from 'react'

const settingsTabs = [
    { id: 'Profile', label: '👤 Profile' },
    { id: 'Security', label: '🔒 Security' },
    { id: 'Notifications', label: '🔔 Notifications' },
    { id: 'Appearance', label: '🎨 Appearance' },
]

function EmployeeSettings({ active, setActive }) {
    const [settingPage, setSettingPage] = useState('Profile')
    const [changePassword, setChangePassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [notificationSettings, setNotificationSettings] = useState({
        approvedReq: true,
        rejectedReq: true,
        pendingReq: false,
        companyAnnounce: true,
        upcomingRemainder: false,
    })

    const toggleNotification = (key) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    return (
        <div className="employeeSettingsPage">
            <Sidebar active={active} setActive={setActive} />

            <main className="employeeSettingsMain container">
                

                <section className="settingsMain">
                    <div className="settingsHeader">
                        <div>
                            <p className="settingsEyebrow">Account</p>
                            <h1>Settings</h1>
                            <p className="settingsSubtitle">Manage your account and application preferences.</p>
                        </div>
                        <div className="settingsHeaderActions">
                            <button type="button" className="iconAction" aria-label="Notifications">🔔</button>
                            <button type="button" className="avatarAction" aria-label="Profile">MS</button>
                        </div>
                    </div>

                    <div className="settingsPanel">
                        <aside className="settingsSidebar">
                            <h2>Settings</h2>

                            <nav className="settingsNav" aria-label="Settings navigation">
                                {settingsTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        className={`settingsTab ${settingPage === tab.id ? 'active' : ''}`}
                                        onClick={() => setSettingPage(tab.id)}
                                    >
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        <div className="settingsContent">
                            {settingPage === 'Profile' && (
                                <div className="settingsSection">
                                    <div className="sectionHeadingRow">
                                        <h2>Profile</h2>
                                    </div>

                                    <div className="profileCard">
                                        <div className="profilePhotoBlock">
                                            <div className="profileImageWrap">
                                                <img src={fakeProfile} alt="Profile" />
                                            </div>
                                            <button type="button" className="secondaryBtn">[ Change photo ]</button>
                                        </div>

                                        <div className="fieldGrid">
                                            <div className="fieldBlock">
                                                <label htmlFor="fullName">Full Name</label>
                                                <input id="fullName" type="text" value="Mayank Sharma" readOnly />
                                            </div>

                                            <div className="fieldBlock">
                                                <label htmlFor="email">Email</label>
                                                <input id="email" type="email" value="mayank@example.com" readOnly />
                                            </div>

                                            <div className="fieldBlock">
                                                <label htmlFor="department">Department</label>
                                                <input id="department" type="text" value="Engineering" readOnly />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="settingsActions">
                                        <button type="button" className="primaryBtn">Save Changes</button>
                                    </div>
                                </div>
                            )}

                            {settingPage === 'Security' && (
                                <div className="settingsSection">
                                    <div className="sectionHeadingRow">
                                        <h2>Security</h2>
                                    </div>

                                    {!changePassword ? (
                                        <div className="securityCard">
                                            <div className="securityInfoRow">
                                                <div className="securityTextBlock">
                                                    <h3>Password</h3>
                                                    <span>Last changed 24 days ago</span>
                                                </div>
                                            </div>

                                            <div className="settingsActions securityAction">
                                                <button type="button" className="secondaryBtn" onClick={() => setChangePassword(true)}>
                                                    [ Change Password ]
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="changePasswordBlock">
                                            <div className="securityHeaderMini">
                                                <h3>Change Password</h3>
                                            </div>

                                            <div className="fieldGrid passwordGrid">
                                                <div className="fieldBlock passwordFieldWrap">
                                                    <label htmlFor="currentpassword">Current password</label>
                                                    <div className="passwordField">
                                                        <input
                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                            id="currentpassword"
                                                            placeholder="Enter current password"
                                                        />
                                                        <button
                                                            type="button"
                                                            className={showCurrentPassword ? 'showBtn show' : 'showBtn hide'}
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                                                        >
                                                            <i className={showCurrentPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="fieldBlock passwordFieldWrap">
                                                    <label htmlFor="newpassword">New password</label>
                                                    <div className="passwordField">
                                                        <input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            id="newpassword"
                                                            placeholder="Enter new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            className={showNewPassword ? 'showBtn show' : 'showBtn hide'}
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                                                        >
                                                            <i className={showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="fieldBlock passwordFieldWrap">
                                                    <label htmlFor="confirmnewpassword">Confirm new password</label>
                                                    <div className="passwordField">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            id="confirmnewpassword"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            className={showConfirmPassword ? 'showBtn show' : 'showBtn hide'}
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                                        >
                                                            <i className={showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="settingsActions securityAction">
                                                <button type="button" className="primaryBtn" onClick={() => setChangePassword(false)}>
                                                    [ Update Password ]
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {settingPage === 'Notifications' && (
                                <div className="settingsSection">
                                    <div className="sectionHeadingRow">
                                        <h2>Notifications</h2>
                                    </div>

                                    <div className="notificationCard">
                                        <div className="notificationGroup">
                                            <h3>Leave Requests</h3>

                                            <div className="notificationRow">
                                                <div className="notificationText">
                                                    <label>Leave request approved</label>
                                                    <span>Receive a notification when your leave request is approved.</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`switch ${notificationSettings.approvedReq ? 'on' : ''}`}
                                                    aria-label={notificationSettings.approvedReq ? 'Turn off approved leave notification' : 'Turn on approved leave notification'}
                                                    onClick={() => toggleNotification('approvedReq')}
                                                >
                                                    <span className="switchThumb" />
                                                </button>
                                            </div>

                                            <div className="notificationRow">
                                                <div className="notificationText">
                                                    <label>Leave request rejected</label>
                                                    <span>Receive a notification when your manager rejects your request.</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`switch ${notificationSettings.rejectedReq ? 'on' : ''}`}
                                                    aria-label={notificationSettings.rejectedReq ? 'Turn off rejected leave notification' : 'Turn on rejected leave notification'}
                                                    onClick={() => toggleNotification('rejectedReq')}
                                                >
                                                    <span className="switchThumb" />
                                                </button>
                                            </div>

                                            <div className="notificationRow">
                                                <div className="notificationText">
                                                    <label>Leave request pending</label>
                                                    <span>Notify me when a manager takes action.</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`switch ${notificationSettings.pendingReq ? 'on' : ''}`}
                                                    aria-label={notificationSettings.pendingReq ? 'Turn off pending leave notification' : 'Turn on pending leave notification'}
                                                    onClick={() => toggleNotification('pendingReq')}
                                                >
                                                    <span className="switchThumb" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="notificationGroup">
                                            <h3>System</h3>

                                            <div className="notificationRow">
                                                <div className="notificationText">
                                                    <label>Company announcements</label>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`switch ${notificationSettings.companyAnnounce ? 'on' : ''}`}
                                                    aria-label={notificationSettings.companyAnnounce ? 'Turn off company announcements' : 'Turn on company announcements'}
                                                    onClick={() => toggleNotification('companyAnnounce')}
                                                >
                                                    <span className="switchThumb" />
                                                </button>
                                            </div>

                                            <div className="notificationRow">
                                                <div className="notificationText">
                                                    <label>Upcoming leave reminder</label>
                                                    <span>Remind me before my approved leave.</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`switch ${notificationSettings.upcomingRemainder ? 'on' : ''}`}
                                                    aria-label={notificationSettings.upcomingRemainder ? 'Turn off upcoming leave reminder' : 'Turn on upcoming leave reminder'}
                                                    onClick={() => toggleNotification('upcomingRemainder')}
                                                >
                                                    <span className="switchThumb" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="settingsActions">
                                        <button type="button" className="primaryBtn">Save Preferences</button>
                                    </div>
                                </div>
                            )}

                            {settingPage === 'Appearance' && (
                                <div className="settingsSection">
                                    <div className="sectionHeadingRow">
                                        <h2>Appearance</h2>
                                    </div>
                                    <div className="emptyState">Appearance settings coming soon.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default EmployeeSettings