import './dashboard.employee.css'
import Sidebar from '../../components/sidebar'

function StatusBadge({status}){
  const map = {
    Approved: 'approved',
    Pending: 'pending',
    Rejected: 'rejected'
  }
  return (
    <span className={`statusBadge ${map[status]||''}`}>{status}</span>
  )
}

function EmployeeDashboard(){
    const userName = 'Mayank Sharma'

    const stats = [
      {label: 'Total Leaves', value: 18, icon: '📅'},
      {label: 'Approved', value: 12, icon: '✅'},
      {label: 'Pending', value: 4, icon: '⏳'},
      {label: 'Rejected', value: 2, icon: '✖️'},
    ]

    const recent = [
      {type: 'Sick Leave', date: '2026-07-30', status: 'Approved'},
      {type: 'Casual Leave', date: '2026-07-18', status: 'Pending'},
      {type: 'Work From Home', date: '2026-07-10', status: 'Rejected'},
      {type: 'Annual Leave', date: '2026-06-25', status: 'Approved'},
    ]

    return(
        <div className="dashboardPage">
            <Sidebar />

            <main className="dashboardMain container">
                {/* Top navbar */}
                <header className="topNavbar card">
                    <div className="greeting">
                        <div className="greetingText">
                          <div className="muted">Welcome back,</div>
                          <h1 className="welcomeName">{userName}</h1>
                        </div>
                        <div className="navActions">
                          <button className="iconBtn" aria-label="Notifications">🔔</button>
                          <button className="avatarBtn" aria-label="Profile">M</button>
                        </div>
                    </div>
                </header>

                {/* Stats row */}
                <section className="statsRow">
                  {stats.map((s) => (
                    <div key={s.label} className="statCard card">
                      <div className="statIcon">{s.icon}</div>
                      <div className="statBody">
                        <div className="statValue">{s.value}</div>
                        <div className="statLabel">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Main grid: calendar + recent leaves */}
                <section className="mainGrid">
                  <div className="calendarCard card">
                    <div className="cardHeader">
                      <h3>Calendar</h3>
                      <div className="muted">Highlights: Approved / Pending / Holiday</div>
                    </div>
                    <div className="calendarPlaceholder">
                      {/* Minimal calendar mock - replace with real calendar component later */}
                      <div className="calendarGrid">
                        {Array.from({length: 30}).map((_, i) => {
                          const day = i+1
                          const classes = [ 'day' ]
                          // example highlights
                          if([2,7,18].includes(day)) classes.push('approved')
                          if([9,20].includes(day)) classes.push('pending')
                          if([14].includes(day)) classes.push('holiday')
                          return <div key={i} className={classes.join(' ')}>{day}</div>
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="recentCard card">
                    <div className="cardHeader">
                      <h3>Recent Leaves</h3>
                      <div className="muted">Most recent requests</div>
                    </div>
                    <div className="tableWrap">
                      <table className="recentTable">
                        <thead>
                          <tr>
                            <th>Leave Type</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recent.map((r, idx) => (
                            <tr key={idx}>
                              <td>{r.type}</td>
                              <td>{r.date}</td>
                              <td><StatusBadge status={r.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

            </main>
        </div>
    )
}

export default EmployeeDashboard