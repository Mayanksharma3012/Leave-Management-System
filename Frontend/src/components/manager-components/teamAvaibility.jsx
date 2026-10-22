import './teamAvaibility.css'

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

export default function TeamAvaibility({ requests = [], employees = [], isLoading = false }) {
    const today = getDateString(new Date())
    const employeesOnLeave = new Set(
        requests
            .filter((leave) => {
                const start = String(leave.startDate || '').slice(0, 10)
                const end = String(leave.endDateReal || leave.endDate || start).slice(0, 10)
                return normalizeStatus(leave.status) === 'approved' && start <= today && end >= today
            })
            .map(getEmployeeId)
    )
    const onLeaveCount = employeesOnLeave.size
    const availableCount = Math.max(0, employees.length - onLeaveCount)
    const availability = [
        { label: 'Team Available', count: availableCount, detail: 'employees available today', tone: 'available' },
        { label: 'On Leave', count: onLeaveCount, detail: 'employees away today', tone: 'onLeave' },
    ]

    return (
        <section className="teamAvailability" aria-labelledby="team-availability-heading">
            <h2 id="team-availability-heading">Team Availability</h2>
            <div className="teamAvailabilityGrid">
                {availability.map(({ label, count, detail, tone }) => (
                    <article className={`teamAvailabilityCard ${tone}`} key={label}>
                        <div>
                            <h3>{label}</h3>
                            <p>{detail}</p>
                        </div>
                        <span className="teamAvailabilityCount">{isLoading ? '—' : count}</span>
                    </article>
                ))}
            </div>
        </section>
    )
}