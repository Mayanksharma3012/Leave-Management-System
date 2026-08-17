import LeaveCalendar from '../../components/calendar'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import SummaryGrid from '../../components/summaryGrid'
import './calendar.employee.css'


function CalendarEmployee() {

    

    return (
        <>
            <div className="employeeCalendarPage">
                <Sidebar />
                <main className="employeeCalendarMain container">
                    <Navbar  />
                    <section className='calendarMain'>
                        <SummaryGrid/>
                        <div className="calendar-container">
                            <LeaveCalendar/>
                        </div>
                      

                    </section>
                </main>
            </div>
        </>
    )
}

export default CalendarEmployee