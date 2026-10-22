import './dashboard.manager.css'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import ManagerSummaryGrid from '../../components/manager-components/summaryGrid.manager'
import ManagerPendingLeave from '../../components/manager-components/pendingLeaveComponent'
import TeamAvaibility from '../../components/manager-components/teamAvaibility'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ManagerDashboardPage() {
    const [leaves, setLeaves] = useState([])
    const [employees, setEmployees] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [reloadCount, setReloadCount] = useState(0)

    useEffect(() => {
        let isActive = true

        const fetchDashboardData = async () => {
            setIsLoading(true)
            setLoadError('')
            try {
                const [leaveResponse, employeeResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/manager/leaverequests`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL}/manager/employees`, { withCredentials: true }),
                ])
                if (!Array.isArray(leaveResponse.data?.leaves)) {
                    throw new Error('The server returned an unexpected leave requests response.')
                }
                if (!Array.isArray(employeeResponse.data?.employees)) {
                    throw new Error('The server returned an unexpected employees response.')
                }
                if (isActive) {
                    setLeaves(leaveResponse.data.leaves)
                    setEmployees(employeeResponse.data.employees)
                }
            } catch (error) {
                if (isActive) {
                    setLoadError(error.response?.data?.message || error.message || 'Unable to load dashboard data.')
                }
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        fetchDashboardData()
        return () => {
            isActive = false
        }
    }, [reloadCount])

    const handleRequestReviewed = (requestId, status) => {
        setLeaves((currentLeaves) => currentLeaves.map((leave) => (
            String(leave._id) === requestId ? { ...leave, status: `${status}-leave` } : leave
        )))
    }

    return (
        <div className="managerDashboardPage">
            <Sidebar />
            <main className="managerDashboardMain">
                <Navbar />
                {loadError && (
                    <div className="managerDashboardDataMessage" role="alert">
                        <span>Unable to load dashboard data: {loadError}</span>
                        <button type="button" onClick={() => setReloadCount((count) => count + 1)}>
                            Try again
                        </button>
                    </div>
                )}
                <ManagerSummaryGrid
                    requests={leaves}
                    employees={employees}
                    isLoading={isLoading}
                />
                <ManagerPendingLeave onRequestReviewed={handleRequestReviewed} />
                <TeamAvaibility
                    requests={leaves}
                    employees={employees}
                    isLoading={isLoading}
                />
            </main>
        </div>
    )
}