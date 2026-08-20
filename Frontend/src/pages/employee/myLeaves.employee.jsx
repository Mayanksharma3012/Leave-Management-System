import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import SummaryGrid from '../../components/summaryGrid'
import './myLeaves.employee.css'
import { useState } from 'react'

const leaveIcons = {
  annual: '🌴',
  casual: '🏖',
  sick: '🩺',
  paid: '💼',
  maternity: '🍼',
  study: '📚',
  unpaid: '📅',
  volunteer: '🤝',
  medical: '⚕️',
  halfday: '⏱️',
}

function getLeaveIcon(title = '') {
  const leaveType = title.toLowerCase().split(' ')[0]
  return leaveIcons[leaveType] || '🗓️'
}

function formatDate(date) {
  if (!date) return 'Not provided'
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}


function getLeaveStatus(leave) {
  const validStatuses = ['pending', 'approved', 'rejected']
  const status =  leave.classNames?.[0]?.replace('-leave', '') || 'pending'
  if (!validStatuses.includes(status)) {
    return null
}
  return status
}


function MyLeaves({ submitedFormData }) {
  const [selectedLeave, setSelectedLeave] = useState(null)

  return (
    <div className="employeeMyLeavesPage">
      <Sidebar />
      <main className="employeeMyLeavesMain container">
        <Navbar />

        <section className="myLeavesMain">
          <SummaryGrid />

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
                <option value="annual Leave">Annual Leave</option>
                <option value="sick Leave">Sick Leave</option>
                <option value="casual Leave">Casual Leave</option>
                <option value="paid Leave">Paid Leave</option>
                <option value="maternity Leave">Maternity Leave</option>
                <option value="study Leave">Study Leave</option>
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
                  {submitedFormData.map((leave, index) => {

                    const status = getLeaveStatus(leave)
                    if( status === null ) return [];

                    const endDate = leave.endReal || leave.end
                    return (
                      <tr key={`${leave.title}-${leave.start}-${index}`}>
                        <td>
                          <div className="leaveTypeCell">
                            <span className="typeIcon" aria-hidden="true">{getLeaveIcon(leave.title)}</span>
                            <span>{leave.title}</span>
                          </div>
                        </td>
                        <td>{formatDate(leave.start)} - {formatDate(endDate)}</td>
                        <td>{leave.days || '—'}</td>
                        <td>
                          <span className={`statusBadge ${status}`}>{status}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="tableAction"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      {selectedLeave && (
        <div
          className="leaveDetailsBackdrop"
          onClick={() => setSelectedLeave(null)}
        >
          <section
            className="leaveDetailsDialog"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="closeDetailsButton"
              onClick={() => setSelectedLeave(null)}
            >
              ×
            </button>

            <div className="detailsHeader">
              <span className="typeIcon">
                {getLeaveIcon(selectedLeave.title)}
              </span>

              <div>
                <p className="detailsLabel">Leave Request</p>
                <h2>{selectedLeave.title}</h2>
              </div>
            </div>

            <div className="detailsStatus">
              <span className={`statusBadge ${getLeaveStatus(selectedLeave)}`}>
                {getLeaveStatus(selectedLeave)}
              </span>
            </div>

            <div className="detailsGrid">

              <div>
                <span>Date Range</span>
                <strong>
                  {formatDate(selectedLeave.start)} –{' '}
                  {formatDate(selectedLeave.endReal || selectedLeave.end)}
                </strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>
                  {selectedLeave.days ?? '—'} days
                </strong>
              </div>

              <div className="reasonDetail">
                <span>Reason</span>
                <strong>
                  {selectedLeave.reason || 'Not provided'}
                </strong>
              </div>

            </div>

            {selectedLeave.document && (
              <div className="documentDetail">
                <span>Attachment</span>
                <button type="button">
                  View Document
                </button>
              </div>
            )}

          </section>
        </div>
      )}
    </div>
  )
}

export default MyLeaves