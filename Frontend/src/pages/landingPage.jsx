import './landingPage.css'
import Footer from '../components/footer'
import { Link } from 'react-router-dom'
const calendarCells = [
    { day: '1',status: 'holiday', label: 'Holiday' },
    { day: '2', status: 'approved', label: 'Approved' },
    { day: '3', status: 'work', label: 'Work Day' },
    { day: '4', status: 'work', label: 'Work Day'  },
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
    { day: '18', status: 'holiday', label: 'Holiday'  },
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

function LandingPage(){
    return(
        <>
            <header className="landingNavbar">
                <div className="left">
                    <div className="logo"></div>
                    <div className="brand-text">
                        <h1 className="name">LeaveManager</h1>
                        <p className="tagline">Smart leave approval for modern teams</p>
                    </div>
                </div>

                <div className="right">
                    <nav className="links">
                        <a href="#hero">Home</a>
                        <a href="#calendar">Calendar</a>
                        <a href="#about">About</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#contact">Contact</a>
                    </nav>
                    <div className="sign">
                        <button className='loginBtn'><Link to='/login'></Link>Login</button>
                        <button className='getStartedBtn'><Link to='/register'></Link>Get Started</button>
                    </div>
                </div>
            </header>

            <main className="hero-section" id="hero">
                <section className="hero-copy">
                    <span className="hero-badge">Leave Management System</span>
                    <h1>Manage employee leave with speed, clarity, and confidence.</h1>
                    <p>Track requests, approve faster, and keep your team aligned with a clean, modern dashboard built for HR and managers.</p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary"><Link to='/register'></Link>Get Started</button>
                        <button className="btn btn-secondary">See Features</button>
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
                    <div className="calendar-legend">
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
            <Footer/>
        </>
    )
}

export default LandingPage