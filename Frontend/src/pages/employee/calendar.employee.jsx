import LeaveCalendar from '../../components/calendar'
import Navbar from '../../components/header'
import Sidebar from '../../components/sidebar'
import SummaryGrid from '../../components/summaryGrid'
import './calendar.employee.css'


function CalendarEmployee({ active, setActive }) {

    

    return (
        <>
            <div className="employeeCalendarPage">
                <Sidebar active={active} setActive={setActive} />
                <main className="employeeCalendarMain container">
                    <Navbar active={active} />
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