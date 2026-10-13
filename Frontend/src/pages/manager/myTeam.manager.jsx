import Sidebar from '../../components/sidebar.jsx'
import Navbar from '../../components/header.jsx'
import TeamMembers from '../../components/manager-components/teamMembers.component.jsx'
import './myTeam.manager.css'

export default function ManagerTeamPage() {
  return (
    <div className="managerTeamPage">
      <Sidebar />
      <main className="managerTeamMain">
        <Navbar />
        <TeamMembers />
      </main>
    </div>
  )
}
