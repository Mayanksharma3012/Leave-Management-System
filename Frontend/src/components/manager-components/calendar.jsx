import { useEffect, useState } from 'react'
import axios from 'axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

const leaveTypeLegend = [
    { label: 'Annual Leave', className: 'annual-leave' },
    { label: 'Sick Leave', className: 'sick-leave' },
    { label: 'Casual Leave', className: 'casual-leave' },
    { label: 'Maternity Leave', className: 'maternity-leave' },
    { label: 'Study Leave', className: 'study-leave' },
    { label: 'Unpaid Leave', className: 'unpaid-leave' },
    { label: 'Volunteer Leave', className: 'volunteer-leave' },
    { label: 'Medical Leave', className: 'medical-leave' },
    { label: 'Half-Day Leave', className: 'halfday-leave' },
]

function toDateString(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}

function shiftDate(value, days) {
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
    if (Number.isNaN(date.getTime())) return ''
    date.setDate(date.getDate() + days)
    return toDateString(date)
}

function formatDate(value) {
    if (!value) return 'Not provided'
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`)
    if (Number.isNaN(date.getTime())) return String(value)
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

function normalizeStatus(value) {
    const status = String(value || '').toLowerCase().replace(/-leave$/, '')
    return status.charAt(0).toUpperCase() + status.slice(1)
}

function getInitials(name) {
    return String(name || '')
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

function getTypeClass(leaveType) {
    return String(leaveType || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function mapApprovedLeave(leave) {
    const name = leave.employee?.userName || 'Unknown employee'
    const start = String(leave.startDate || '').slice(0, 10)
    const endReal = String(leave.endDateReal || leave.endDate || start).slice(0, 10)
    const leaveType = leave.leaveType || 'Leave'

    return {
        id: String(leave._id),
        employeeId: String(leave.employee?._id || leave.employee || leave._id),
        name,
        team: leave.employee?.department || '—',
        leaveType,
        start,
        end: shiftDate(endReal, 1),
        endReal,
        days: leave.days ?? Math.max(1, Math.round((new Date(`${endReal}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000) + 1),
        status: normalizeStatus(leave.status),
        reason: leave.reason || '',
        document: leave.document || null,
        title: `${name} · ${leaveType}`,
        allDay: true,
        classNames: [`manager-${getTypeClass(leaveType)}`],
    }
}

function ManagerCalendar() {
    const [approvedLeaves, setApprovedLeaves] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [reloadCount, setReloadCount] = useState(0)
    const [selectedLeave, setSelectedLeave] = useState(null)
    const [isCompactViewport, setIsCompactViewport] = useState(
        () => window.matchMedia('(max-width: 900px)').matches
    )
    const today = toDateString(new Date())

    useEffect(() => {
        let isActive = true

        const fetchApprovedLeaves = async () => {
            setIsLoading(true)
            setLoadError('')
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/manager/leaverequests`,
                    { withCredentials: true }
                )
                if (!Array.isArray(response.data?.leaves)) {
                    throw new Error('The server returned an unexpected leave requests response.')
                }
                if (isActive) {
                    setApprovedLeaves(
                        response.data.leaves
                            .filter((leave) => normalizeStatus(leave.status) === 'Approved')
                            .map(mapApprovedLeave)
                    )
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(error.response?.data?.message || error.message || 'Unable to load approved leave.')
                }
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        fetchApprovedLeaves()
        return () => {
            isActive = false
        }
    }, [reloadCount])

    useEffect(() => {
        const viewportQuery = window.matchMedia('(max-width: 900px)')
        const updateViewport = (event) => setIsCompactViewport(event.matches)

        viewportQuery.addEventListener('change', updateViewport)
        return () => viewportQuery.removeEventListener('change', updateViewport)
    }, [])

    useEffect(() => {
        if (!selectedLeave) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setSelectedLeave(null)
        }

        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selectedLeave])

    const leavesToday = approvedLeaves.filter((leave) => leave.start <= today && leave.endReal >= today)
    const visibleLeavesToday = leavesToday
    const upcomingLeaves = approvedLeaves
        .filter((leave) => leave.start > today)
        .sort((first, second) => first.start.localeCompare(second.start))
    const visibleUpcomingLeaves = upcomingLeaves
    const upcomingThisWeek = upcomingLeaves.filter((leave) => {
        const daysUntilLeave = (new Date(`${leave.start}T00:00:00`) - new Date(`${today}T00:00:00`)) / 86400000
        return daysUntilLeave <= 7
    })
    const employeeCount = new Set(approvedLeaves.map((leave) => leave.employeeId)).size
    const leaveTypeCounts = approvedLeaves.reduce((counts, leave) => {
        counts[leave.leaveType] = (counts[leave.leaveType] || 0) + 1
        return counts
    }, {})
    const leaveTypeEntries = Object.entries(leaveTypeCounts).sort((first, second) => second[1] - first[1])
    const summaryCards = [
        { label: 'Approved requests', value: approvedLeaves.length, tone: 'members', icon: '✓' },
        { label: 'On leave today', value: leavesToday.length, tone: 'away', icon: '✈' },
        { label: 'Starting this week', value: upcomingThisWeek.length, tone: 'upcoming', icon: '◷' },
        { label: 'Employees with approved leave', value: employeeCount, tone: 'available', icon: '♧' },
    ]

    const handleEventClick = ({ event }) => {
        setSelectedLeave({
            ...event.extendedProps,
            name: event.extendedProps.name,
            start: event.startStr,
            endReal: event.extendedProps.endReal || shiftDate(event.endStr, -1),
        })
    }

    return (
        <section className="managerCalendarContent" aria-label="Team calendar">
            <div className="managerCalendarSummary" aria-label="Team leave summary">
                {summaryCards.map((card) => (
                    <article className={`managerCalendarSummaryCard ${card.tone}`} key={card.label}>
                        <span className="managerCalendarSummaryIcon" aria-hidden="true">{card.icon}</span>
                        <div>
                            <strong>{card.value}</strong>
                            <span>{card.label}</span>
                        </div>
                    </article>
                ))}
            </div>

            <div className="managerCalendarLayout">
                <section className="managerCalendarPanel" aria-label="Approved leave calendar">
                    {loadError && (
                        <div className="managerCalendarNotice" role="alert">
                            <span>Unable to load approved leave: {loadError}</span>
                            <button type="button" onClick={() => setReloadCount((count) => count + 1)}>
                                Try again
                            </button>
                        </div>
                    )}
                    {isLoading && <p className="managerCalendarNotice" role="status">Loading approved leave…</p>}
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={today}
                        events={approvedLeaves}
                        eventClick={handleEventClick}
                        height={isCompactViewport ? 'auto' : '100%'}
                        expandRows
                        dayMaxEvents={3}
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'today dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        buttonText={{
                            today: 'Today',
                            month: 'Month',
                            week: 'Week',
                            day: 'Day',
                        }}
                        eventContent={({ event }) => (
                            <span className="managerCalendarEvent">
                                <span className="managerCalendarEventInitials" aria-hidden="true">
                                    {getInitials(event.extendedProps.name)}
                                </span>
                                <span className="managerCalendarEventName">{event.extendedProps.name}</span>
                            </span>
                        )}
                    />
                    <div className="managerCalendarLegend" aria-label="Approved leave types">
                        {leaveTypeLegend.map((type) => (
                            <span className={type.className} key={type.className}>{type.label}</span>
                        ))}
                    </div>
                </section>

                <aside className="managerCalendarSidebar">
                    <section className="managerCalendarAsideSection">
                        <div className="managerCalendarAsideHeading">
                            <h2>Employees on Leave Today</h2>
                            <span>{visibleLeavesToday.length}</span>
                        </div>
                        {visibleLeavesToday.length ? visibleLeavesToday.map((leave) => (
                            <button
                                type="button"
                                className="managerCalendarMember"
                                key={leave.id}
                                onClick={() => setSelectedLeave(leave)}
                            >
                                <span className="managerCalendarAvatar">{getInitials(leave.name)}</span>
                                <span className="managerCalendarMemberInfo">
                                    <strong>{leave.name}</strong>
                                    <small>{leave.team}</small>
                                </span>
                                <span className={`managerCalendarTypeBadge ${getTypeClass(leave.leaveType)}`}>
                                    {leave.leaveType}
                                </span>
                            </button>
                        )) : <p className="managerCalendarEmpty">No approved leave today.</p>}
                    </section>

                    <section className="managerCalendarAsideSection managerCalendarAvailability">
                        <div className="managerCalendarAsideHeading">
                            <h2>Approved Leave by Type</h2>
                        </div>
                        {leaveTypeEntries.length ? (
                            <div className="managerCalendarLeaveTypes">
                                {leaveTypeEntries.map(([type, count]) => (
                                    <div className="managerCalendarLeaveTypeRow" key={type}>
                                        <span className={`managerCalendarTypeBadge ${getTypeClass(type)}`}>{type}</span>
                                        <strong>{count}</strong>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="managerCalendarEmpty">No approved leave requests.</p>}
                    </section>

                    <section className="managerCalendarAsideSection managerCalendarUpcoming">
                        <div className="managerCalendarAsideHeading">
                            <h2>Upcoming Approved Leave</h2>
                            <span>{visibleUpcomingLeaves.length}</span>
                        </div>
                        {visibleUpcomingLeaves.slice(0, 4).map((leave) => (
                            <button
                                type="button"
                                className="managerCalendarUpcomingItem"
                                key={leave.id}
                                onClick={() => setSelectedLeave(leave)}
                            >
                                <span className="managerCalendarDateTile">
                                    <strong>{new Date(`${leave.start}T00:00:00`).getDate()}</strong>
                                    <small>{new Date(`${leave.start}T00:00:00`).toLocaleString(undefined, { month: 'short' })}</small>
                                </span>
                                <span className="managerCalendarUpcomingInfo">
                                    <strong>{leave.name}</strong>
                                    <small>{leave.team}</small>
                                </span>
                                <span className={`managerCalendarTypeBadge ${getTypeClass(leave.leaveType)}`}>
                                    {leave.leaveType}
                                </span>
                            </button>
                        ))}
                        {!visibleUpcomingLeaves.length && (
                            <p className="managerCalendarEmpty">No upcoming approved leave is scheduled.</p>
                        )}
                    </section>
                </aside>
            </div>

            {selectedLeave && (
                <div
                    className="managerCalendarDialogBackdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setSelectedLeave(null)
                    }}
                >
                    <section
                        className="managerCalendarDialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="manager-calendar-dialog-title"
                    >
                        <header className="managerCalendarDialogHeader">
                            <div>
                                <p>Approved leave details</p>
                                <h2 id="manager-calendar-dialog-title">{selectedLeave.name}</h2>
                                <span>{selectedLeave.team}</span>
                            </div>
                            <button
                                type="button"
                                aria-label="Close leave details"
                                onClick={() => setSelectedLeave(null)}
                            >
                                ×
                            </button>
                        </header>
                        <div className="managerCalendarDialogGrid">
                            <div>
                                <span>Leave type</span>
                                <strong>{selectedLeave.leaveType}</strong>
                            </div>
                            <div>
                                <span>Status</span>
                                <strong className="managerCalendarStatus approved">{selectedLeave.status}</strong>
                            </div>
                            <div>
                                <span>Start date</span>
                                <strong>{formatDate(selectedLeave.start)}</strong>
                            </div>
                            <div>
                                <span>End date</span>
                                <strong>{formatDate(selectedLeave.endReal)}</strong>
                            </div>
                            <div>
                                <span>Duration</span>
                                <strong>{selectedLeave.days} {selectedLeave.days === 1 ? 'day' : 'days'}</strong>
                            </div>
                            <div className="managerCalendarDialogReason">
                                <span>Reason</span>
                                <strong>{selectedLeave.reason || 'Not provided'}</strong>
                            </div>
                            {selectedLeave.document && (
                                <div className="managerCalendarDialogDocument">
                                    <span>Attachment</span>
                                    <strong>
                                        {typeof selectedLeave.document === 'string'
                                            ? selectedLeave.document.split(/[\\/]/).pop().split(/[?#]/)[0]
                                            : selectedLeave.document.name || 'Attached document'}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </section>
    )
}

export default ManagerCalendar
