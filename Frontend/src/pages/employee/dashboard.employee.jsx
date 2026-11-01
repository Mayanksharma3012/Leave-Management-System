import './calendar.employee.css'
import './dashboard.employee.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'
import LeaveCalendar from '../../components/employee-components/calendar'
import { useEffect, useState } from 'react'
import axios from 'axios'
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

  const [leaves, setLeaves] = useState([])
  
      useEffect(() => {
          const fetchLeaves = async () => {
              try {
                  const response = await axios.get(
                      `${import.meta.env.VITE_BACKEND_URL}/user/getleaves`,
                      { withCredentials: true }
                  )
                  if (!Array.isArray(response.data?.leaves)) {
                      throw new Error('The leave response did not contain a leaves array')
                  }
                  setLeaves(response.data.leaves)
              } catch (error) {
                  console.error('Failed to fetch leaves:', error)
              }
          }
  
          fetchLeaves()
      }, [])
  
      const counts = leaves.reduce(
          (summary, leave) => {
              const status = leave.status?.replace(/-leave$/, '').toLowerCase()
              if (status === 'approved' || status === 'pending' || status === 'rejected') {
                  summary[status] += 1
              }
              return summary
          },
          { approved: 0, pending: 0, rejected: 0 }
      )
  

    const stats = [
      {label: 'Total Leaves', value: leaves.length, icon: '📅', tone: 'total' },
      {label: 'Approved', value: counts.approved, icon: '✅', tone: 'approved'},
      {label: 'Pending', value: counts.pending, icon: '⏳', tone: 'pending'},
      {label: 'Rejected', value: counts.rejected, icon: '✖️', tone: 'rejected'},
    ]

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const orderedRecentLeaves = [...(submitedFormData || [])]
      .filter((leave) => checkleave(leave))
      .sort((firstLeave, secondLeave) => {
        const getDate = (date) => new Date(`${date}T00:00:00`)
        const firstStart = getDate(firstLeave.start)
        const firstEnd = getDate(firstLeave.endReal || firstLeave.end || firstLeave.start)
        const secondStart = getDate(secondLeave.start)
        const secondEnd = getDate(secondLeave.endReal || secondLeave.end || secondLeave.start)

        const getCategory = (start, end) => {
          if (start <= today && end >= today) return 0
          if (start > today) return 1
          return 2
        }

        const firstCategory = getCategory(firstStart, firstEnd)
        const secondCategory = getCategory(secondStart, secondEnd)
        if (firstCategory !== secondCategory) return firstCategory - secondCategory
        if (firstCategory === 1) return firstStart - secondStart
        if (firstCategory === 2) return secondStart - firstStart
        return firstStart - secondStart
      })
      .slice(0, 8)

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
                          {orderedRecentLeaves.map((leave, idx) => (
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