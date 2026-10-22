import './summaryGrid.manager.css'

function normalizeStatus(value) {
    return String(value || '').toLowerCase().replace(/-leave$/, '')
}

function getDateString(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-')
}

function getEmployeeId(leave) {
    return String(leave.employee?._id || leave.employee || leave._id)
}

export default function ManagerSummaryGrid({ requests = [], employees = [], isLoading = false }) {
    const today = getDateString(new Date())
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekString = getDateString(nextWeek)
    const onLeaveToday = new Set(
        requests
            .filter((leave) => {
                const start = String(leave.startDate || '').slice(0, 10)
                const end = String(leave.endDateReal || leave.endDate || start).slice(0, 10)
                return normalizeStatus(leave.status) === 'approved' && start <= today && end >= today
            })
            .map(getEmployeeId)
    )
    const upcomingAbsences = requests.filter((leave) => {
        const start = String(leave.startDate || '').slice(0, 10)
        return normalizeStatus(leave.status) === 'approved' && start > today && start <= nextWeekString
    }).length
    const summaryCards = [
        { label: 'Total Employees', value: employees.length, tone: 'employees' },
        { label: 'Pending Leaves', value: requests.filter((leave) => normalizeStatus(leave.status) === 'pending').length, tone: 'pending' },
        { label: 'On Leave Today', value: onLeaveToday.size, tone: 'today' },
        { label: 'Upcoming Absence', value: upcomingAbsences, tone: 'upcoming' },
    ]

    return (
        <section className="managerSummaryGrid" aria-label="Team leave summary">
            {summaryCards.map((item) => (
                <article key={item.label} className={`managerSummaryCard ${item.tone}`}>
                    <h3>{item.label}</h3>
                    <span>{isLoading ? '—' : item.value}</span>
                </article>
            ))}
        </section>
    )
}