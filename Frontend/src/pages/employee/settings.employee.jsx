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
                                    <div className="emptyState">Security settings content coming soon.</div>
                                </div>
                            )}

                            {settingPage === 'Notifications' && (
                                <div className="settingsSection">
                                    <div className="sectionHeadingRow">
                                        <h2>Notifications</h2>
                                    </div>
                                    <div className="emptyState">Notification preferences coming soon.</div>
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