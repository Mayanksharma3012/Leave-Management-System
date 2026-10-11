import './pendingLeaveComponent.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ManagerPendingLeave() {
    const [pendingLeaves, setPendingLeaves] = useState([
        {
            id: 1,
            name: 'Olivia Martinez',
            initials: 'OM',
            leaveType: 'Annual leave',
            startDate: 'Oct 12',
            endDate: 'Oct 14',
        },
        {
            id: 2,
            name: 'Ethan Johnson',
            initials: 'EJ',
            leaveType: 'Sick leave',
            startDate: 'Oct 13',
            endDate: 'Oct 13',
        },
        {
            id: 3,
            name: 'Sophia Williams',
            initials: 'SW',
            leaveType: 'Personal leave',
            startDate: 'Oct 15',
            endDate: 'Oct 16',
        },
    ])
    const [reviewMessage, setReviewMessage] = useState('')

    const handleReview = (leaveId, decision) => {
        const leave = pendingLeaves.find((item) => item.id === leaveId)
        if (leave) {
            setReviewMessage(`${leave.name}'s request ${decision}.`)
        }
        setPendingLeaves((leaves) => leaves.filter((leave) => leave.id !== leaveId))
    }

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

            {pendingLeaves.length > 0 ? (
                <ul className="pendingLeavesList">
                    {pendingLeaves.map((leave) => (
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
                                        {leave.startDate} – {leave.endDate}
                                    </p>
                                </div>
                            </div>
                            <div className="pendingLeaveActions">
                                <button
                                    className="pendingLeaveAction accept"
                                    type="button"
                                    aria-label={`Accept ${leave.name}'s leave request`}
                                    title="Accept request"
                                    onClick={() => handleReview(leave.id, 'accepted')}
                                >
                                    <span aria-hidden="true">✓</span>
                                </button>
                                <button
                                    className="pendingLeaveAction reject"
                                    type="button"
                                    aria-label={`Reject ${leave.name}'s leave request`}
                                    title="Reject request"
                                    onClick={() => handleReview(leave.id, 'rejected')}
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

            <footer className="pendingLeavesFooter">
                <Link className="pendingLeavesReviewAll" to="/manager/leave-requests">
                    Review all requests
                    <span aria-hidden="true">→</span>
                </Link>
            </footer>
        </section>
    )
}