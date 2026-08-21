import './calendar.employee.css'
import './dashboard.employee.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'
import LeaveCalendar from '../../components/calendar'

function StatusBadge({status}){

  const validStatuses = ['pending', 'approved', 'rejected']
  const statusClass = Array.isArray(status)
  ? status.find((item) => validStatuses.includes(item?.replace('-leave', '').toLowerCase()))
    : status
  const normalizedStatus = statusClass?.replace('-leave', '').toLowerCase()

  if (!validStatuses.includes(normalizedStatus)) {
    return null
  }
  return (
    <span className={`statusBadge ${normalizedStatus}`}>
      {normalizedStatus}
    </span>
  )
}

function checkleave(leave) {
  const validStatuses = ['pending', 'approved', 'rejected']
  const status =  leave.classNames?.[0]?.replace('-leave', '').toLowerCase()
  if (!validStatuses.includes(status)) {
    return null
}
  return status
}

function EmployeeDashboard({ submitedFormData }){

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
            <Sidebar/>

            <main className="dashboardMain container">
                {/* Top navbar */}
                <Navbar/>

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
                    
                    <div className="calendarPlaceholder">
                      {/* Minimal calendar mock - replace with real calendar component later */}
                      {/* <div className="calendarGrid">
                        {Array.from({length: 30}).map((_, i) => {
                          const day = i+1
                          const classes = [ 'day' ]
                          // example highlights
                          if([2,7,18].includes(day)) classes.push('approved')
                          if([9,20].includes(day)) classes.push('pending')
                          if([14].includes(day)) classes.push('holiday')
                          return <div key={i} className={classes.join(' ')}>{day}</div>
                        })}
                      </div> */}

                      <LeaveCalendar submitedFormData={submitedFormData}/>

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
                          {(submitedFormData || [])
                            .filter((leave) => checkleave(leave))
                            .map((leave, idx) => (
                            <tr key={idx}>
                              <td>{leave.title}</td>
                              <td>{leave.start}</td>
                              <td><StatusBadge status={leave.classNames} /></td>
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