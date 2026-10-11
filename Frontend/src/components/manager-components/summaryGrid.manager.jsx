import './summaryGrid.manager.css'

export default function ManagerSummaryGrid(){
    const summaryCards = [
        { label: 'Total Employees', value: 24, tone: 'employees' },
        { label: 'Pending Leaves', value: 5, tone: 'pending' },
        { label: 'On Leave Today', value: 3, tone: 'today' },
        { label: 'Upcoming Absence', value: 4, tone: 'upcoming' },
    ]

    return (
        <section className="managerSummaryGrid" aria-label="Team leave summary">
            {summaryCards.map((item) => (
                <article key={item.label} className={`managerSummaryCard ${item.tone}`}>
                    <h3>{item.label}</h3>
                    <span>{item.value}</span>
                </article>
            ))}
        </section>
    )
}