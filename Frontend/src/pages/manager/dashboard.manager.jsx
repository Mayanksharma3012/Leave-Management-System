import './dashboard.manager.css'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import ManagerSummaryGrid from '../../components/manager-components/summaryGrid.manager'
import ManagerPendingLeave from '../../components/manager-components/pendingLeaveComponent'
import TeamAvaibility from '../../components/manager-components/teamAvaibility'

export default function ManagerDashboardPage(){
    return(
        <div className="managerDashboardPage">
            <Sidebar/>
            <main className="managerDashboardMain">
                <Navbar/>
                <ManagerSummaryGrid/>
                <ManagerPendingLeave/>
                <TeamAvaibility/>
            </main>
        </div>
    )
}