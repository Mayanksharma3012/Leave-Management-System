import { useEffect, useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

function formatDate(date) {
    if (!date) return 'Not provided'
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${date.slice(0, 10)}T00:00:00`))
}

function getDateOffset(offset) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}

function shiftDate(date, days) {
    const shiftedDate = new Date(`${date.slice(0, 10)}T00:00:00`)
    shiftedDate.setDate(shiftedDate.getDate() + days)
    return [
        shiftedDate.getFullYear(),
        String(shiftedDate.getMonth() + 1).padStart(2, '0'),
        String(shiftedDate.getDate()).padStart(2, '0'),
    ].join('-')
}

const demoLeaveDetails = [
    {
        name: 'Rahul Sharma',
        team: 'Engineering',
        leaveType: 'Casual Leave',
        offset: -12,
        days: 2,
        status: 'Approved',
        reason: 'Personal work that requires my attention.',
        document: 'travel_tickets.pdf',
    },
    {
        name: 'Priya Patel',
        team: 'Design',
        leaveType: 'Sick Leave',
        offset: -10,
        days: 2,
        status: 'Approved',
        reason: 'I need a couple of days to recover from an illness.',
    },
    {
        name: 'Amit Verma',
        team: 'Marketing',
        leaveType: 'Earned Leave',
        offset: -8,
        days: 3,
        status: 'Approved',
        reason: 'Planning a short family trip.',
    },
    {
        name: 'Sneha Choudhary',
        team: 'Human Resources',
        leaveType: 'Sick Leave',
        offset: -5,
        days: 1,
        status: 'Pending',
        reason: 'Medical appointment.',
    },
    {
        name: 'Deepak Kumar',
        team: 'Engineering',
        leaveType: 'Casual Leave',
        offset: -3,
        days: 1,
        status: 'Approved',
        reason: 'Taking a personal day.',
    },
    {
        name: 'Isha Agarwal',
        team: 'Quality Assurance',
        leaveType: 'Casual Leave',
        offset: 0,
        days: 1,
        status: 'Approved',
        reason: 'Using a planned day off.',
    },
    {
        name: 'Karan Rajput',
        team: 'Frontend Development',
        leaveType: 'Sick Leave',
        offset: 0,
        days: 2,
        status: 'Pending',
        reason: 'Recovering from a seasonal illness.',
    },
    {
        name: 'Neha Tiwari',
        team: 'Product',
        leaveType: 'Work From Home',
        offset: 2,
        days: 1,
        status: 'Approved',
        reason: 'Home maintenance appointment.',
    },
    {
        name: 'Priya Patel',
        team: 'Design',
        leaveType: 'Sick Leave',
        offset: 5,
        days: 1,
        status: 'Pending',
        reason: 'Follow-up medical appointment.',
    },
    {
        name: 'Amit Verma',
        team: 'Marketing',
        leaveType: 'Earned Leave',
        offset: 7,
        days: 3,
        status: 'Approved',
        reason: 'Planned family vacation.',
    },
    {
        name: 'Meera Sethi',
        team: 'Human Resources',
        leaveType: 'Casual Leave',
        offset: 10,
        days: 1,
        status: 'Pending',
        reason: 'Personal appointment.',
    },
    {
        name: 'Vikram Singh',
        team: 'Design',
        leaveType: 'Earned Leave',
        offset: 13,
        days: 2,
        status: 'Approved',
        reason: 'Attending a family event.',
    },
]

const demoLeaves = demoLeaveDetails.map((leave, index) => {
    const start = getDateOffset(leave.offset)
    const endReal = shiftDate(start, leave.days - 1)
    const typeClass = leave.leaveType.toLowerCase().replaceAll(' ', '-')

    return {
        ...leave,
        id: `demo-leave-${index + 1}`,
        title: `${leave.name} · ${leave.leaveType}`,
        start,
        end: shiftDate(endReal, 1),
        endReal,
        allDay: true,
        classNames: [`manager-${typeClass}`, `manager-${leave.status.toLowerCase()}`],
    }
})

function getInitials(name) {
    return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
}

function ManagerCalendar() {
    const [search, setSearch] = useState('')
    const [selectedLeave, setSelectedLeave] = useState(null)
    const [isCompactViewport, setIsCompactViewport] = useState(
        () => window.matchMedia('(max-width: 900px)').matches
    )
    const today = getDateOffset(0)

    useEffect(() => {
        const viewportQuery = window.matchMedia('(max-width: 900px)')
        const updateViewport = (event) => setIsCompactViewport(event.matches)

        viewportQuery.addEventListener('change', updateViewport)
        return () => viewportQuery.removeEventListener('change', updateViewport)
    }, [])

    const visibleLeaves = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return demoLeaves

        return demoLeaves.filter((leave) => (
            `${leave.name} ${leave.team} ${leave.leaveType}`.toLowerCase().includes(query)
        ))
    }, [search])

    const leavesToday = demoLeaves.filter((leave) => (
        leave.start <= today && leave.endReal >= today && leave.status !== 'Rejected'
    ))
    const visibleLeavesToday = visibleLeaves.filter((leave) => (
        leave.start <= today && leave.endReal >= today && leave.status !== 'Rejected'
    ))
    const upcomingLeaves = demoLeaves
        .filter((leave) => leave.start > today && leave.status !== 'Rejected')
        .sort((first, second) => first.start.localeCompare(second.start))
    const visibleUpcomingLeaves = visibleLeaves
        .filter((leave) => leave.start > today && leave.status !== 'Rejected')
        .sort((first, second) => first.start.localeCompare(second.start))
    const upcomingThisWeek = upcomingLeaves.filter((leave) => {
        const daysUntilLeave = (new Date(`${leave.start}T00:00:00`) - new Date(`${today}T00:00:00`))
            / (24 * 60 * 60 * 1000)
        return daysUntilLeave <= 7
    })
    const availablePercentage = ((24 - leavesToday.length) / 25) * 100
    const leavePercentage = (leavesToday.length / 25) * 100
    const holidayPercentage = availablePercentage + leavePercentage

    useEffect(() => {
        if (!selectedLeave) return undefined

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setSelectedLeave(null)
        }

        document.addEventListener('keydown', closeOnEscape)
        return () => document.removeEventListener('keydown', closeOnEscape)
    }, [selectedLeave])

    const summaryCards = [
        { label: 'Total Members', value: 24, tone: 'members', icon: '♧' },
        { label: 'Available Today', value: 24 - leavesToday.length, tone: 'available', icon: '✓' },
        { label: 'On Leave Today', value: leavesToday.length, tone: 'away', icon: '✈' },
        { label: 'Upcoming Leaves', value: upcomingThisWeek.length, tone: 'upcoming', icon: '◷' },
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
            {/* <header className="managerCalendarHeading">
                <div>
                    <h1>Team Calendar</h1>
                    <p>View your team&apos;s leave schedule and plan work accordingly.</p>
                </div>
                <label className="managerCalendarSearch">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search employees..."
                        aria-label="Search employees"
                    />
                </label>
            </header> */}

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
                <section className="managerCalendarPanel" aria-label="Leave schedule calendar">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={today}
                        events={visibleLeaves}
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
                    <div className="managerCalendarLegend" aria-label="Leave type legend">
                        <span className="casual">Casual Leave</span>
                        <span className="sick">Sick Leave</span>
                        <span className="earned">Earned Leave</span>
                        <span className="work-home">Work From Home</span>
                    </div>
                </section>

                <aside className="managerCalendarSidebar">
                    <section className="managerCalendarAsideSection">
                        <div className="managerCalendarAsideHeading">
                            <h2>Team Members on Leave</h2>
                            <span>{leavesToday.length}</span>
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
                                <span className={`managerCalendarTypeBadge ${leave.leaveType.toLowerCase().replaceAll(' ', '-')}`}>
                                    {leave.leaveType}
                                </span>
                            </button>
                        )) : <p className="managerCalendarEmpty">No team members are away today.</p>}
                    </section>

                    <section className="managerCalendarAsideSection managerCalendarAvailability">
                        <div className="managerCalendarAsideHeading">
                            <h2>Team Availability</h2>
                        </div>
                        <div
                            className="managerCalendarAvailabilityRing"
                            style={{
                                background: `conic-gradient(#16a34a 0 ${availablePercentage}%, #2563eb ${availablePercentage}% ${holidayPercentage}%, #e2e8f0 ${holidayPercentage}% 100%)`,
                            }}
                        >
                            <div>
                                <strong>{24 - leavesToday.length}</strong>
                                <span>Available</span>
                            </div>
                        </div>
                        <div className="managerCalendarAvailabilityKey">
                            <span><i className="available-dot" />{24 - leavesToday.length} Available</span>
                            <span><i className="leave-dot" />{leavesToday.length} On Leave</span>
                            <span><i className="other-dot" />1 Holiday / Weekend</span>
                        </div>
                    </section>

                    <section className="managerCalendarAsideSection managerCalendarUpcoming">
                        <div className="managerCalendarAsideHeading">
                            <h2>Upcoming Leaves</h2>
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
                                    <small>{new Date(`${leave.start}T00:00:00`).toLocaleString('en-US', { month: 'short' })}</small>
                                </span>
                                <span className="managerCalendarUpcomingInfo">
                                    <strong>{leave.name}</strong>
                                    <small>{leave.team}</small>
                                </span>
                                <span className={`managerCalendarTypeBadge ${leave.leaveType.toLowerCase().replaceAll(' ', '-')}`}>
                                    {leave.leaveType}
                                </span>
                            </button>
                        ))}
                        {!visibleUpcomingLeaves.length && (
                            <p className="managerCalendarEmpty">No upcoming leave is scheduled.</p>
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
                                <p>Leave details</p>
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
                                <strong className={`managerCalendarStatus ${selectedLeave.status.toLowerCase()}`}>
                                    {selectedLeave.status}
                                </strong>
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
                                            ? selectedLeave.document
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
