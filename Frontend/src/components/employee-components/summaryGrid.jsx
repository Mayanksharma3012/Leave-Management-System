import './summaryGrid.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function SummaryGrid() {
    const [leaves, setLeaves] = useState([])

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/user/getleaves`,
                    { withCredentials: true }
                )
                if (!Array.isArray(response.data?.leaves)) {
                    throw new Error('The leave response did not contain a leaves array')
                }
                setLeaves(response.data.leaves)
            } catch (error) {
                console.error('Failed to fetch leaves:', error)
            }
        }

        fetchLeaves()
    }, [])

    const counts = leaves.reduce(
        (summary, leave) => {
            const status = leave.status?.replace(/-leave$/, '').toLowerCase()
            if (status === 'approved' || status === 'pending' || status === 'rejected') {
                summary[status] += 1
            }
            return summary
        },
        { approved: 0, pending: 0, rejected: 0 }
    )

    const summaryCards = [
        { label: 'Total', value: leaves.length, tone: 'total' },
        { label: 'Approved', value: counts.approved, tone: 'approved' },
        { label: 'Pending', value: counts.pending, tone: 'pending' },
        { label: 'Rejected', value: counts.rejected, tone: 'rejected' },
    ]

    return (
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