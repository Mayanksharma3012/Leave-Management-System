import './pendingLeaveComponent.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function formatDate(value) {
    if (!value) return '—'
    const dateValue = String(value).slice(0, 10)
    const date = new Date(`${dateValue}T12:00:00`)
    return Number.isNaN(date.getTime())
        ? dateValue
        : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function normalizeStatus(value) {
    const status = String(value || '').toLowerCase().replace(/-leave$/, '')
    return status.charAt(0).toUpperCase() + status.slice(1)
}

function mapLeaveRequest(leave) {
    const name = leave.employee?.userName || 'Unknown employee'
    const startLabel = formatDate(leave.startDate)
    const endLabel = formatDate(leave.endDateReal || leave.endDate || leave.startDate)

    return {
        id: String(leave._id),
        name,
        initials: name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        leaveType: leave.leaveType || 'Leave',
        dates: startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`,
        status: normalizeStatus(leave.status),
    }
}

export default function ManagerPendingLeave() {
    const [pendingLeaves, setPendingLeaves] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [reviewingId, setReviewingId] = useState(null)
    const [reviewMessage, setReviewMessage] = useState('')
    const [reviewError, setReviewError] = useState('')

    useEffect(() => {
        let isActive = true

        const fetchLeaveRequests = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/manager/leaverequests`, { withCredentials: true })
                if (!Array.isArray(response.data?.leaves)) {
                    throw new Error('The server returned an unexpected leave requests response.')
                }
                if (isActive) {
                    setPendingLeaves(response.data.leaves.map(mapLeaveRequest).filter((leave) => leave.status === 'Pending'))
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(error.response?.data?.message || error.message || 'Unable to load leave requests.')
                }
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        fetchLeaveRequests()
        return () => {
            isActive = false
        }
    }, [])

    const handleReview = async (leave, status) => {
        setReviewingId(leave.id)
        setReviewMessage('')
        setReviewError('')
        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/manager/leaverequests/${leave.id}/review`,
                { status },
                { withCredentials: true }
            )
            setPendingLeaves((leaves) => leaves.filter((item) => item.id !== leave.id))
            setReviewMessage(`${leave.name}'s request was ${status}.`)
        } catch (error) {
            setReviewError(error.response?.data?.message || error.message || 'Unable to review leave request.')
        } finally {
            setReviewingId(null)
        }
    }

    const visibleLeaves = pendingLeaves.slice(0, 3)

    return (
        <section className="pendingLeavesPanel" aria-labelledby="pending-leaves-heading">
            <header className="pendingLeavesHeader">
                <div>
                    <h2 id="pending-leaves-heading">Pending Leaves</h2>
                    <p>Review your team's latest requests</p>
                </div>
                <Link className="pendingLeavesViewAll" to="/manager/leave-requests">
                    View all <span aria-hidden="true">→</span>
                </Link>
            </header>

            {isLoading ? (
                <p className="pendingLeavesEmpty">Loading leave requests…</p>
            ) : loadError ? (
                <p className="pendingLeavesEmpty" role="alert">Unable to load leave requests: {loadError}</p>
            ) : visibleLeaves.length > 0 ? (
                <ul className="pendingLeavesList">
                    {visibleLeaves.map((leave) => (
                        <li className="pendingLeaveItem" key={leave.id}>
                            <div className="pendingLeaveEmployee">
                                <div className="pendingLeaveAvatar" aria-hidden="true">
                                    {leave.initials}
                                </div>
                                <div className="pendingLeaveDetails">
                                    <h3>{leave.name}</h3>
                                    <p>
                                        {leave.leaveType}
                                        <span aria-hidden="true"> · </span>
                                        {leave.dates}
                                    </p>
                                </div>
                            </div>
                            <div className="pendingLeaveActions">
                                <button
                                    className="pendingLeaveAction accept"
                                    type="button"
                                    aria-label={`Approve ${leave.name}'s leave request`}
                                    title="Approve request"
                                    disabled={reviewingId !== null}
                                    onClick={() => handleReview(leave, 'approved')}
                                >
                                    <span aria-hidden="true">✓</span>
                                </button>
                                <button
                                    className="pendingLeaveAction reject"
                                    type="button"
                                    aria-label={`Reject ${leave.name}'s leave request`}
                                    title="Reject request"
                                    disabled={reviewingId !== null}
                                    onClick={() => handleReview(leave, 'rejected')}
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="pendingLeavesEmpty">No pending leave requests.</p>
            )}
            <p className="sr-only" aria-live="polite">{reviewMessage}</p>
            {reviewError && <p className="pendingLeavesFeedback" role="alert">{reviewError}</p>}

            <footer className="pendingLeavesFooter">
                <Link className="pendingLeavesReviewAll" to="/manager/leave-requests">
                    Review all requests
                    <span aria-hidden="true">→</span>
                </Link>
            </footer>
        </section>
    )
}
