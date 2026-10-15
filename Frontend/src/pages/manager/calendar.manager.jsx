import './calendar.manager.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'
import ManagerCalendar from '../../components/manager-components/calendar'

export default function ManagerCalendarPage() {
    return (
        <>
            <div className="managerCalendarPage">
                <Sidebar />
                <main className="managerCalendarMain">
                    <Navbar />
                    <ManagerCalendar />
                </main>
            </div>
        </>
    )
}