import './summaryGrid.css'

function SummaryGrid(){

    const summaryCards = [
        { label: 'Total', value: 18, tone: 'total' },
        { label: 'Approved', value: 12, tone: 'approved' },
        { label: 'Pending', value: 3, tone: 'pending' },
        { label: 'Rejected', value: 3, tone: 'rejected' },
    ]


    return(
        <>
              <div className="summaryGrid" aria-label="Leave summary">
                            {summaryCards.map((item) => (
                                <div key={item.label} className={`summaryCard ${item.tone}`}>
                                    <h3>{item.label}</h3>
                                    <span>{item.value}</span>
                                </div>
                            ))}
                        </div>
        </>
    )
}

export default SummaryGrid