import './dashboard.manager.css'
import './leaveRequests.manager.css'
import { useEffect, useMemo, useState } from 'react'
import '../../components/manager-components/summaryGrid.manager.css'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'

const demoRequests = [
    { id: 1, name: 'Rahul Sharma', initials: 'RS', team: 'Engineering', leaveType: 'Casual Leave', dates: 'Oct 12 – Oct 13', duration: '2 days', appliedOn: 'Oct 8, 10:30 AM', reason: 'Personal work that requires my attention.', document: 'travel_tickets.pdf', status: 'Pending' },
    { id: 2, name: 'Priya Patel', initials: 'PP', team: 'Design', leaveType: 'Sick Leave', dates: 'Oct 14', duration: '1 day', appliedOn: 'Oct 10, 9:15 AM', reason: 'I need a day to recover from an illness.', status: 'Pending' },
    { id: 3, name: 'Amit Verma', initials: 'AV', team: 'Marketing', leaveType: 'Earned Leave', dates: 'Oct 20 – Oct 22', duration: '3 days', appliedOn: 'Oct 9, 2:45 PM', reason: 'Planning a short family trip.', status: 'Pending' },
    { id: 4, name: 'Sneha Choudhary', initials: 'SC', team: 'Human Resources', leaveType: 'Casual Leave', dates: 'Oct 28', duration: '1 day', appliedOn: 'Oct 8, 11:20 AM', reason: 'Personal appointment.', status: 'Approved' },
    { id: 5, name: 'Deepak Kumar', initials: 'DK', team: 'Engineering', leaveType: 'Sick Leave', dates: 'Oct 5 – Oct 7', duration: '3 days', appliedOn: 'Oct 1, 8:40 AM', reason: 'Medical rest advised by my doctor.', status: 'Approved' },
    { id: 6, name: 'Neha Tiwari', initials: 'NT', team: 'Product', leaveType: 'Work From Home', dates: 'Oct 16', duration: '1 day', appliedOn: 'Oct 10, 1:05 PM', reason: 'Home maintenance appointment.', status: 'Rejected' },
    { id: 7, name: 'Vikram Singh', initials: 'VK', team: 'Design', leaveType: 'Casual Leave', dates: 'Oct 25 – Oct 26', duration: '2 days', appliedOn: 'Oct 7, 3:10 PM', reason: 'Attending a family event.', status: 'Approved' },
    { id: 8, name: 'Isha Agarwal', initials: 'IA', team: 'Quality Assurance', leaveType: 'Earned Leave', dates: 'Oct 30 – Nov 1', duration: '3 days', appliedOn: 'Oct 10, 10:00 AM', reason: 'Using planned annual leave.', status: 'Approved' },
]

const statusFilters = ['All', 'Pending', 'Approved', 'Rejected']
const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Work From Home']
const pageSize = 6

function getAttachmentName(document) {
    if (typeof document === 'string') {
        return document.split(/[\\/]/).pop().split(/[?#]/)[0]
    }
    return document?.name || 'Attached document'
}

function getAttachmentUrl(document) {
    if (typeof document === 'string' && /^(https?:|blob:|data:)/i.test(document)) {
        return document
    }
    return document?.url || document?.downloadURL || null
}

export default function ManagerLeaveRequestsPage() {
    const [requests, setRequests] = useState(demoRequests)
    const [activeStatus, setActiveStatus] = useState('All')
    const [search, setSearch] = useState('')
    const [leaveType, setLeaveType] = useState('All')
    const [page, setPage] = useState(1)
    const [reviewMessage, setReviewMessage] = useState('')
    const [selectedRequestId, setSelectedRequestId] = useState(null)
    const [isEditingRequest, setIsEditingRequest] = useState(false)
    const [requestDraft, setRequestDraft] = useState(null)
    const selectedRequest = requests.find((request) => request.id === selectedRequestId)

    useEffect(() => {
        if (!selectedRequestId) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setSelectedRequestId(null)
                setIsEditingRequest(false)
            }
        }

        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selectedRequestId])

    const counts = useMemo(() => ({
        All: requests.length,
        Pending: requests.filter((request) => request.status === 'Pending').length,
        Approved: requests.filter((request) => request.status === 'Approved').length,
        Rejected: requests.filter((request) => request.status === 'Rejected').length,
    }), [requests])

    const filteredRequests = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()
        return requests.filter((request) => {
            const matchesStatus = activeStatus === 'All' || request.status === activeStatus
            const matchesType = leaveType === 'All' || request.leaveType === leaveType
            const matchesSearch = !normalizedSearch || [
                request.name,
                request.team,
                request.leaveType,
                request.dates,
                request.status,
            ].some((value) => value.toLowerCase().includes(normalizedSearch))
            return matchesStatus && matchesType && matchesSearch
        })
    }, [activeStatus, leaveType, requests, search])

    const pageCount = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
    const currentPage = Math.min(page, pageCount)
    const visibleRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    const summaryCards = [
        { label: 'Total requests', value: counts.All, tone: 'employees' },
        { label: 'Pending', value: counts.Pending, tone: 'pending' },
        { label: 'Approved', value: counts.Approved, tone: 'today' },
        { label: 'Rejected', value: counts.Rejected, tone: 'rejected' },
    ]

    const updateFilter = (update) => {
        update()
        setPage(1)
    }

    const handleReview = (request, status) => {
        setRequests((currentRequests) => currentRequests.map((item) => (
            item.id === request.id ? { ...item, status } : item
        )))
        setReviewMessage(`${request.name}'s request was ${status.toLowerCase()}.`)
    }

    const openRequest = (request) => {
        setSelectedRequestId(request.id)
        setIsEditingRequest(false)
        setRequestDraft({ ...request })
    }

    const saveRequestEdits = () => {
        if (!requestDraft) return
        setRequests((currentRequests) => currentRequests.map((request) => (
            request.id === requestDraft.id ? { ...request, ...requestDraft } : request
        )))
        setIsEditingRequest(false)
        setReviewMessage(`${requestDraft.name}'s request details were updated.`)
    }

    const resetFilters = () => {
        setActiveStatus('All')
        setSearch('')
        setLeaveType('All')
        setPage(1)
    }

    return (
        <div className="managerDashboardPage">
            <Sidebar/>
            <main className="managerDashboardMain">
                <Navbar/>
                <section className="leaveRequestsPage" aria-label="Team leave requests">
                    <div className="leaveRequestsSummary" aria-label="Leave request summary">
                        {summaryCards.map((item) => (
                            <article className={`managerSummaryCard ${item.tone}`} key={item.label}>
                                <h3>{item.label}</h3>
                                <span>{item.value}</span>
                            </article>
                        ))}
                    </div>

                    <section className="leaveRequestsPanel" aria-label="Leave request list">
                        <div className="leaveRequestsFilters">
                            <label className="leaveRequestSearch">
                                <span className="sr-only">Search by employee, team, leave type, or status</span>
                                <span aria-hidden="true">⌕</span>
                                <input
                                    type="search"
                                    placeholder="Search requests..."
                                    value={search}
                                    onChange={(event) => updateFilter(() => setSearch(event.target.value))}
                                />
                            </label>
                            <label className="leaveTypeFilter">
                                <span className="sr-only">Filter by leave type</span>
                                <select
                                    value={leaveType}
                                    onChange={(event) => updateFilter(() => setLeaveType(event.target.value))}
                                >
                                    <option value="All">All leave types</option>
                                    {leaveTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </label>
                            <button className="leaveRequestsReset" type="button" onClick={resetFilters}>
                                Reset filters
                            </button>
                        </div>

                        <div className="leaveRequestTabs" role="group" aria-label="Filter requests by status">
                            {statusFilters.map((status) => (
                                <button
                                    className={activeStatus === status ? 'active' : ''}
                                    type="button"
                                    key={status}
                                    aria-pressed={activeStatus === status}
                                    onClick={() => updateFilter(() => setActiveStatus(status))}
                                >
                                    {status} <span>{counts[status]}</span>
                                </button>
                            ))}
                        </div>

                        <div className="leaveRequestsTableWrap">
                            <table className="leaveRequestsTable">
                                <thead>
                                    <tr>
                                        <th scope="col">Employee</th>
                                        <th scope="col">Leave type</th>
                                        <th scope="col">Dates</th>
                                        <th scope="col">Duration</th>
                                        <th scope="col">Applied on</th>
                                        <th scope="col">Status</th>
                                        <th scope="col"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleRequests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="leaveRequestRow"
                                            tabIndex="0"
                                            onClick={(event) => {
                                                if (!event.target.closest('button, a, input, select, textarea')) openRequest(request)
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                                                    event.preventDefault()
                                                    openRequest(request)
                                                }
                                            }}
                                            aria-label={`View ${request.name}'s leave request`}
                                        >
                                            <td>
                                                <div className="leaveRequestEmployee">
                                                    <span className="leaveRequestAvatar" aria-hidden="true">{request.initials}</span>
                                                    <span>
                                                        <strong>{request.name}</strong>
                                                        <small>{request.team}</small>
                                                    </span>
                                                </div>
                                            </td>
                                            <td><span className="leaveTypeBadge">{request.leaveType}</span></td>
                                            <td>{request.dates}</td>
                                            <td>{request.duration}</td>
                                            <td>{request.appliedOn}</td>
                                            <td><span className={`leaveStatusBadge ${request.status.toLowerCase()}`}>{request.status}</span></td>
                                            <td>
                                                {request.status === 'Pending' ? (
                                                    <div className="leaveRequestActions">
                                                        <button
                                                            type="button"
                                                            className="approveRequestButton"
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                handleReview(request, 'Approved')
                                                            }}
                                                            aria-label={`Approve ${request.name}'s request`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rejectRequestButton"
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                handleReview(request, 'Rejected')
                                                            }}
                                                            aria-label={`Reject ${request.name}'s request`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : <span className="leaveRequestNoAction" aria-label="No actions available">—</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    {visibleRequests.length === 0 && (
                                        <tr>
                                            <td className="leaveRequestsEmpty" colSpan="7">No requests match these filters.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <footer className="leaveRequestsFooter">
                            <p>
                                {filteredRequests.length === 0
                                    ? 'No requests to display'
                                    : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredRequests.length)} of ${filteredRequests.length} requests`}
                            </p>
                            <div className="leaveRequestsPagination" aria-label="Request pages">
                                <button
                                    type="button"
                                    aria-label="Previous page"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage(currentPage - 1)}
                                >‹</button>
                                <span>Page {currentPage} of {pageCount}</span>
                                <button
                                    type="button"
                                    aria-label="Next page"
                                    disabled={currentPage === pageCount}
                                    onClick={() => setPage(currentPage + 1)}
                                >›</button>
                            </div>
                        </footer>
                    </section>
                    <p className="sr-only" aria-live="polite">{reviewMessage}</p>
                </section>
            </main>
            {selectedRequest && (
                <div
                    className="leaveRequestDialogBackdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedRequestId(null)
                            setIsEditingRequest(false)
                        }
                    }}
                >
                    <section
                        className="leaveRequestDialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="leave-request-dialog-title"
                    >
                        <header className="leaveRequestDialogHeader">
                            <div>
                                <p className="leaveRequestDialogEyebrow">Leave request details</p>
                                <h2 id="leave-request-dialog-title">
                                    {isEditingRequest ? 'Edit request' : selectedRequest.name}
                                </h2>
                            </div>
                            <button
                                className="leaveRequestDialogClose"
                                type="button"
                                aria-label="Close request details"
                                onClick={() => {
                                    setSelectedRequestId(null)
                                    setIsEditingRequest(false)
                                }}
                            >
                                ×
                            </button>
                        </header>

                        {!isEditingRequest ? (
                            <>
                                <div className="leaveRequestProfile">
                                    <div className="leaveRequestProfileImage" role="img" aria-label={`${selectedRequest.name} profile image`}>
                                        <svg viewBox="0 0 64 64" aria-hidden="true">
                                            <circle cx="32" cy="32" r="30" fill="var(--primary)" opacity=".12" />
                                            <circle cx="32" cy="23" r="10" fill="var(--primary)" opacity=".78" />
                                            <path d="M13 55c1.5-12 8.5-18 19-18s17.5 6 19 18" fill="var(--primary)" opacity=".78" />
                                        </svg>
                                    </div>
                                    <div className="leaveRequestProfileInfo">
                                        <h3>{selectedRequest.name}</h3>
                                        <p>{selectedRequest.team}</p>
                                    </div>
                                    <span className={`leaveStatusBadge ${selectedRequest.status.toLowerCase()}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>

                                <div className="leaveRequestDetailsGrid">
                                    <div className="leaveRequestDetail">
                                        <span>Leave type</span>
                                        <strong>{selectedRequest.leaveType}</strong>
                                    </div>
                                    <div className="leaveRequestDetail">
                                        <span>Dates</span>
                                        <strong>{selectedRequest.dates}</strong>
                                    </div>
                                    <div className="leaveRequestDetail">
                                        <span>Duration</span>
                                        <strong>{selectedRequest.duration}</strong>
                                    </div>
                                    <div className="leaveRequestDetail">
                                        <span>Applied on</span>
                                        <strong>{selectedRequest.appliedOn}</strong>
                                    </div>
                                    <div className="leaveRequestDetail leaveRequestReason">
                                        <span>Reason</span>
                                        <p>{selectedRequest.reason}</p>
                                    </div>
                                    <div className="leaveRequestAttachment">
                                        <div className="leaveRequestAttachmentIcon" aria-hidden="true">↗</div>
                                        <div className="leaveRequestAttachmentInfo">
                                            <span>Supporting document</span>
                                            {selectedRequest.document ? (
                                                <strong>{getAttachmentName(selectedRequest.document)}</strong>
                                            ) : (
                                                <strong className="leaveRequestNoAttachment">No document attached</strong>
                                            )}
                                        </div>
                                        {selectedRequest.document && getAttachmentUrl(selectedRequest.document) && (
                                            <a
                                                className="leaveRequestAttachmentLink"
                                                href={getAttachmentUrl(selectedRequest.document)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {selectedRequest.status === 'Pending' && (
                                    <footer className="leaveRequestDialogActions">
                                        <button
                                            className="leaveRequestEditButton"
                                            type="button"
                                            onClick={() => {
                                                setRequestDraft({ ...selectedRequest })
                                                setIsEditingRequest(true)
                                            }}
                                        >
                                            Edit request
                                        </button>
                                        <button
                                            className="leaveRequestDialogReject"
                                            type="button"
                                            onClick={() => handleReview(selectedRequest, 'Rejected')}
                                        >
                                            Reject request
                                        </button>
                                    </footer>
                                )}
                            </>
                        ) : (
                            <form
                                className="leaveRequestEditForm"
                                onSubmit={(event) => {
                                    event.preventDefault()
                                    saveRequestEdits()
                                }}
                            >
                                <div className="leaveRequestProfile leaveRequestEditProfile">
                                    <div className="leaveRequestProfileImage" role="img" aria-label={`${selectedRequest.name} profile image`}>
                                        <svg viewBox="0 0 64 64" aria-hidden="true">
                                            <circle cx="32" cy="32" r="30" fill="var(--primary)" opacity=".12" />
                                            <circle cx="32" cy="23" r="10" fill="var(--primary)" opacity=".78" />
                                            <path d="M13 55c1.5-12 8.5-18 19-18s17.5 6 19 18" fill="var(--primary)" opacity=".78" />
                                        </svg>
                                    </div>
                                    <div className="leaveRequestProfileInfo">
                                        <h3>{selectedRequest.name}</h3>
                                        <p>Editing pending request</p>
                                    </div>
                                    <span className="leaveStatusBadge pending">Pending</span>
                                </div>
                                <label>
                                    Team
                                    <input
                                        value={requestDraft.team}
                                        onChange={(event) => setRequestDraft({ ...requestDraft, team: event.target.value })}
                                        required
                                    />
                                </label>
                                <label>
                                    Leave type
                                    <select
                                        value={requestDraft.leaveType}
                                        onChange={(event) => setRequestDraft({ ...requestDraft, leaveType: event.target.value })}
                                    >
                                        {leaveTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </label>
                                <label>
                                    Dates
                                    <input
                                        value={requestDraft.dates}
                                        onChange={(event) => setRequestDraft({ ...requestDraft, dates: event.target.value })}
                                        required
                                    />
                                </label>
                                <label>
                                    Duration
                                    <input
                                        value={requestDraft.duration}
                                        onChange={(event) => setRequestDraft({ ...requestDraft, duration: event.target.value })}
                                        required
                                    />
                                </label>
                                <label className="leaveRequestEditReason">
                                    Reason
                                    <textarea
                                        value={requestDraft.reason}
                                        onChange={(event) => setRequestDraft({ ...requestDraft, reason: event.target.value })}
                                        rows="3"
                                        required
                                    />
                                </label>
                                <div className="leaveRequestDialogActions">
                                    <button
                                        className="leaveRequestEditButton"
                                        type="submit"
                                    >
                                        Save changes
                                    </button>
                                    <button
                                        className="leaveRequestDialogCancel"
                                        type="button"
                                        onClick={() => setIsEditingRequest(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            )}
        </div>
    )
}
