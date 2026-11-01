import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import SummaryGrid from '../../components/employee-components/summaryGrid'
import EditLeaveForm from '../../components/editLeaveForm'
import './myLeaves.employee.css'
import { useEffect, useState } from 'react'

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
  const [editLeave, setEditLeave] = useState(false)
  const [leaveToEdit, setLeaveToEdit] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const leavesPerPage = 6

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sortedLeaves = [...(submitedFormData || [])].sort((firstLeave, secondLeave) => {
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

  const validLeaves = sortedLeaves.filter((leave) => getLeaveStatus(leave) !== null)
  const pageCount = Math.max(1, Math.ceil(validLeaves.length / leavesPerPage))
  const safeCurrentPage = Math.min(currentPage, pageCount)
  const visibleLeaves = validLeaves.slice(
    (safeCurrentPage - 1) * leavesPerPage,
    safeCurrentPage * leavesPerPage
  )

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount))
  }, [pageCount])

  return (
    <div className="employeeMyLeavesPage">
      <Sidebar />
      <main className="employeeMyLeavesMain container">
        <Navbar />

        <section className="myLeavesMain">
          <SummaryGrid />

          {editLeave ? (
            leaveToEdit && (
              <EditLeaveForm
                leave={leaveToEdit}
                onCancel={() => {
                  setEditLeave(false)
                  setLeaveToEdit(null)
                }}
              />
            )
          ) : (<div className="leaveHistoryPanel">
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
                    <th className="leaveActionsHeading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLeaves.map((leave, index) => {
                    const status = getLeaveStatus(leave)

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
                          <div className="leaveActions">
                            <button
                              type="button"
                              className="tableAction"
                              onClick={() => setSelectedLeave(leave)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="tableAction"
                              onClick={() => {
                                setSelectedLeave(null)
                                setLeaveToEdit(leave)
                                setEditLeave(true)
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <footer className="leaveHistoryFooter">
              <p>
                {validLeaves.length === 0
                  ? 'No leaves to display'
                  : `Showing ${(safeCurrentPage - 1) * leavesPerPage + 1}–${Math.min(safeCurrentPage * leavesPerPage, validLeaves.length)} of ${validLeaves.length} leaves`}
              </p>
              <div className="leaveHistoryPagination" aria-label="Leave pages">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage(safeCurrentPage - 1)}
                >‹</button>
                <span>Page {safeCurrentPage} of {pageCount}</span>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={safeCurrentPage === pageCount}
                  onClick={() => setCurrentPage(safeCurrentPage + 1)}
                >›</button>
              </div>
            </footer>
          </div>)}
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