import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import './myLeaves.employee.css'

const summaryCards = [
  { label: 'Total', value: 18, tone: 'total' },
  { label: 'Approved', value: 12, tone: 'approved' },
  { label: 'Pending', value: 3, tone: 'pending' },
  { label: 'Rejected', value: 3, tone: 'rejected' },
]

const leaveRows = [
  { type: 'Sick Leave', icon: '🩺', duration: 'Aug 10 – Aug 12', days: 3, status: 'Approved' },
  { type: 'Casual Leave', icon: '🏖', duration: 'Aug 20 – Aug 21', days: 2, status: 'Pending' },
  { type: 'Paid Leave', icon: '💼', duration: 'Sep 02 – Sep 04', days: 3, status: 'Rejected' },
]

function MyLeaves({ active, setActive }) {
  return (
    <div className="employeeMyLeavesPage">
      <Sidebar active={active} setActive={setActive} />
      <main className="employeeMyLeavesMain container">
        <Navbar active={active} />

        <section className="myLeavesMain">
          <div className="summaryGrid" aria-label="Leave summary">
            {summaryCards.map((item) => (
              <div key={item.label} className={`summaryCard ${item.tone}`}>
                <h3>{item.label}</h3>
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="leaveHistoryPanel">
            <div className="historyHeadingRow">
              <h2>Leave History</h2>
            </div>

            <div className="historyFilters">
              <input type="text" className="searchInput" placeholder="Search" aria-label="Search leave history" />

              <select defaultValue="" aria-label="Filter by status">
                <option value="" disabled>All Status</option>
                <option value="all">All Leaves</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select defaultValue="" aria-label="Filter by leave type">
                <option value="" disabled>Leave Type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="paid">Paid Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="study">Study Leave</option>
              </select>

              <button type="button" className="dateButton">Date</button>
            </div>

            <div className="tableWrapper">
              <table className="leaveTable">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRows.map((row) => (
                    <tr key={`${row.type}-${row.duration}`}>
                      <td>
                        <div className="leaveTypeCell">
                          <span className="typeIcon" aria-hidden="true">{row.icon}</span>
                          <span>{row.type}</span>
                        </div>
                      </td>
                      <td>{row.duration}</td>
                      <td>{row.days}</td>
                      <td>
                        <span className={`statusBadge ${row.status.toLowerCase()}`}>{row.status}</span>
                      </td>
                      <td>
                        <button className="tableAction" aria-label={`View ${row.type}`}>
                          →
                        </button>
                      </td>
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

export default MyLeaves