import './applyLeave.employee.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'

function ApplyLeaveEmployee(){
    const balances = [
      {label: 'Casual', days: '12 days'},
      {label: 'Sick', days: '8 days'},
      {label: 'Paid', days: '15 days'},
    ]

    const holidays = [
      {date: 'Aug 15', label: 'Independence Day'},
      {date: 'Aug 27', label: 'Company Holiday'},
    ]

    return(
        <>
            <div className="employeeLeavePage">
                <Sidebar />
                <main className="employeeLeaveMain container">
                    <Navbar />
                    <section className='leaveMain'>
                        <form className="applyLeave">
                            <h2>Leave Request</h2>
                            <span>Leave Type</span>
                            <select name="Leave Type" id="LeaveTypes">
                                <option value="" disabled selected>-- Choose a leave type --</option>
                                <option value="annual">Annual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="maternity">Maternity Leave</option>
                                <option value="study">Study Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                                <option value="volunteer">Volunteer Leave</option>
                                <option value="medical">Medical Leave</option>
                                <option value="halfday">Half-Day Leave</option>
                            </select>
                            <div className="selectDates">
                                <div className="startDate">
                                    <input type="date" />
                                    <span>Start Date</span>
                                </div>
                                <div className="endDate">
                                    <input type="date" />
                                    <span>End Date</span>
                                </div>
                            </div>

                            <div className="daysOff">
                                <span>3 days off</span>
                            </div>

                            <div className="leaveReason">
                                <span>Reason</span>
                                <input type="text" />
                            </div>
                            <div className="attachDocument">
                                <h3>Attach Document</h3>
                                <span>(optional)</span>
                                <input type="file" />
                            </div>
                            <div className="actionButton">
                                <button className="cancel">Cancel</button>
                                <button className="Submit">Submit</button>
                            </div>
                        </form>
                        <div className="leaveBalance">
                            <div className="leaveBalanceHeader">
                                <h3>Leave Balance</h3>
                                <p className="muted">Available leave days</p>
                            </div>

                            <div className="balanceList">
                                {balances.map((item) => (
                                    <div key={item.label} className="balanceItem">
                                        <span>{item.label}</span>
                                        <strong>{item.days}</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="holidaySection">
                                <div className="holidayHeader">
                                    <h4>Upcoming Holidays</h4>
                                </div>
                                <ul className="holidayList">
                                    {holidays.map((item) => (
                                        <li key={item.date} className="holidayItem">
                                            <span className="holidayDate">{item.date}</span>
                                            <span>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </section>
                </main>
            </div>
        </>
    )
}

export default ApplyLeaveEmployee