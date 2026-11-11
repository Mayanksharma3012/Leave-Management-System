import './landingPage.css'
import Footer from '../components/footer'
import { PublicNavbar } from './publicPages'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
const calendarCells = [
    { day: '1', status: 'holiday', label: 'Holiday' },
    { day: '2', status: 'approved', label: 'Approved' },
    { day: '3', status: 'work', label: 'Work Day' },
    { day: '4', status: 'work', label: 'Work Day' },
    { day: '5', status: 'work', label: 'Work Day' },
    { day: '6', status: 'holiday', label: 'Holiday' },
    { day: '7', status: 'approved', label: 'Approved' },
    { day: '8', status: 'holiday', label: 'Holiday' },
    { day: '9', status: 'work', label: 'Work Day' },
    { day: '10', status: 'approved', label: 'Approved' },
    { day: '11', status: 'work', label: 'Work Day' },
    { day: '12', status: 'work', label: 'Work Day' },
    { day: '13', status: 'rejected', label: 'Rejected' },
    { day: '14', status: 'work', label: 'Work Day' },
    { day: '15', status: 'holiday', label: 'Holiday' },
    { day: '16', status: 'work', label: 'Work Day' },
    { day: '17', status: 'work', label: 'Work Day' },
    { day: '18', status: 'holiday', label: 'Holiday' },
    { day: '19', status: 'work', label: 'Work Day' },
    { day: '20', status: 'work', label: 'Work Day' },
    { day: '21', status: 'work', label: 'Work Day' },
    { day: '22', status: 'holiday', label: 'Holiday' },
    { day: '23', status: 'work', label: 'Work Day' },
    { day: '24', status: 'work', label: 'Work Day' },
    { day: '25', status: 'work', label: 'Work Day' },
    { day: '26', status: 'pending', label: 'Pending' },
    { day: '27', status: 'work', label: 'Work Day' },
    { day: '28', status: 'approved', label: 'Approved' },
    { day: '29', status: 'holiday', label: 'Holiday' },
    { day: '30', status: 'work', label: 'Work Day' },
    { day: '31', status: 'work', label: 'Work Day' },
]

function LandingPage() {
    const location = useLocation()

    useEffect(() => {
        if (location.hash !== '#calendar' && location.hash !== '#hero') return

        document.getElementById(location.hash.slice(1))?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }, [location.hash])

    return (
        <div data-theme='light'>
            <PublicNavbar />

            <main className="hero-section" id="hero">
                <section className="hero-copy">
                    <span className="hero-badge">Leave Management System</span>
                    <h1>Manage employee leave with speed, clarity, and confidence.</h1>
                    <p>Track requests, approve faster, and keep your team aligned with a clean, modern dashboard built for HR and managers.</p>
                    <div className="hero-buttons">
                        <Link className="btn btn-primary" to='/register'>Get Started</Link>
                        <a className="btn btn-secondary" href="#calendar">See Features</a>
                    </div>
                </section>

                <section className="hero-image">
                    <div className="hero-card">
                        <p className="eyebrow">Trusted by HR teams</p>
                        <h2>One workspace for leave requests, approvals, and reports.</h2>
                        <p>Stay on top of holidays, sick days, and remote work with an intuitive interface that your team will actually enjoy using.</p>
                        <div className="stats-row">
                            <div>
                                <strong>12k+</strong>
                                <span>Requests managed</span>
                            </div>
                            <div>
                                <strong>98%</strong>
                                <span>Faster approvals</span>
                            </div>
                            <div>
                                <strong>24/7</strong>
                                <span>Team visibility</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <section className="calendar-section" id="calendar">
                <div className="calendar-header">
                    <div>
                        <p className="section-eyebrow">Leave overview</p>
                        <h2>Track the month at a glance.</h2>
                    </div>
                    <div className="calendar-legendl">
                        <span><i className="legend-dot holiday"></i>Holiday</span>
                        <span><i className="legend-dot approved"></i>Approved</span>
                        <span><i className="legend-dot rejected"></i>Rejected</span>
                        <span><i className="legend-dot pending"></i>Pending</span>
                        <span><i className="legend-dot work"></i>Work Day</span>
                    </div>
                </div>

                <div className="calendar-card">
                    <div className="calendar-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div className="calendar-day header" key={day}>{day}</div>
                        ))}
                        {calendarCells.map((cell) => (
                            <div className={`calendar-day ${cell.status}`} key={`${cell.day}-${cell.status}`}>
                                <span>{cell.day}</span>
                                <em>{cell.label}</em>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default LandingPage