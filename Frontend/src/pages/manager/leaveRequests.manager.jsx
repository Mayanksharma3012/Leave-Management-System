import './dashboard.manager.css'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import ManagerPendingLeave from '../../components/manager-components/pendingLeaveComponent'

export default function ManagerLeaveRequestsPage() {
    return (
        <div className="managerDashboardPage">
            <Sidebar/>
            <main className="managerDashboardMain">
                <Navbar/>
                {/* <ManagerPendingLeave/> */}
            </main>
        </div>
    )
}
