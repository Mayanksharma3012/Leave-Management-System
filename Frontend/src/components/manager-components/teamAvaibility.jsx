import './teamAvaibility.css'

export default function TeamAvaibility() {
    const availability = [
        { label: 'Team Available', count: 21, detail: 'employees available today', tone: 'available' },
        { label: 'On Leave', count: 3, detail: 'employees away today', tone: 'onLeave' },
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
                        <span className="teamAvailabilityCount">{count}</span>
                    </article>
                ))}
            </div>
        </section>
    )
}