import './applyLeave.employee.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'
import { useState, useEffect } from 'react'




function ApplyLeaveEmployee({submitedFormData ,setSubmitedFormData}) {

    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        document: null
    })
    const [formDataErr, setFormDataErr] = useState('')
    const [totalDays, setTotalDays] = useState(0)

    useEffect(() => {
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        if (end >= start) {
            if (start === end) setTotalDays(1)
            else {
                const days = (end - start) / (1000 * 60 * 60 * 24) + 1
                setTotalDays(days)

            }
        }
        else setTotalDays(0)

    }, [formData.startDate, formData.endDate]
    )

    function checkFormData(e) {
        e.preventDefault()

        if (formData.leaveType === '') {
            setFormDataErr('leaveType')
            return
        }
        if (formData.startDate === '') {
            setFormDataErr('startDate')
            return
        }
        if (formData.endDate === '') {
            setFormDataErr('endDate')
            return
        }
        if (formData.reason === '') {
            setFormDataErr('reason')
            return
        }
        const start = new Date(formData.startDate)
        const end = new Date(formData.endDate)
        
        // console.log(formData)

        if (end < start) {
            // invalid date range
            setFormDataErr('invalidDate')
            return
        }

        const newEnd = end.setDate(end.getDate() + 1)
        const newStrEnd = new Date(newEnd).toISOString().split('T')[0];
        // console.log(newStrEnd)

        setSubmitedFormData([...submitedFormData, {
            title: formData.leaveType,
            start: formData.startDate,
            end: newStrEnd,
            endReal: formData.endDate,
            classNames: ["pending-leave"],
            reason: formData.reason,
            document: formData.document,
        }])
        setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        document: null
    })

    }


    const balances = [
        { label: 'Casual', days: '12 days' },
        { label: 'Sick', days: '8 days' },
        { label: 'Paid', days: '15 days' },
    ]

    const holidays = [
        { date: 'Aug 15', label: 'Independence Day' },
        { date: 'Aug 27', label: 'Company Holiday' },
    ]

    return (
        <>
            <div className="employeeLeavePage">
                <Sidebar />
                <main className="employeeLeaveMain container">
                    <Navbar />
                    <section className='leaveMain'>

                        <form className="applyLeave" onSubmit={checkFormData}>
                            <h2>Leave Request</h2>
                            <span>Leave Type</span>
                            <select name="Leave Type" id="LeaveTypes" value={formData.leaveType}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        leaveType: e.target.value
                                    })
                                }
                                }
                            >
                                <option value="" disabled selected>-- Choose a leave type --</option>
                                <option value="annual Leave">Annual Leave</option>
                                <option value="sick Leave">Sick Leave</option>
                                <option value="casual Leave">Casual Leave</option>
                                <option value="maternity Leave">Maternity Leave</option>
                                <option value="study Leave">Study Leave</option>
                                <option value="unpaid Leave">Unpaid Leave</option>
                                <option value="volunteer Leave">Volunteer Leave</option>
                                <option value="medical Leave">Medical Leave</option>
                                <option value="halfday Leave">Half-Day Leave</option>

                            </select>
                            {formDataErr === 'leaveType' && <span className="errorMsg">Please select a leave type for your leave.</span>}

                            <div className="selectDates">
                                <div className="startDate">
                                    <input id='sDate' type="date" value={formData.startDate}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                startDate: e.target.value
                                            })
                                        }} />
                                    <span>Start Date</span>
                                    {formDataErr === 'startDate' && <span className="errorMsg">Please select a start date for your leave.</span>}
                                </div>
                                <div className="endDate">
                                    <input type="date" id='eDate' value={formData.endDate}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                endDate: e.target.value
                                            })
                                        }} />
                                    <span>End Date</span>
                                    {formDataErr === 'endDate' && <span className="errorMsg">Please select a end date for your leave.</span>}
                                    {formDataErr === 'invalidDate' && <span className="errorMsg">Please select a valid date for your leave.</span>}
                                </div>
                            </div>

                            <div className="daysOff">
                                {/*  //todo */}
                                <span> {totalDays} days off</span>
                            </div>

                            <div className="leaveReason">
                                <span>Reason</span>
                                <input type="text" id='eReason' value={formData.reason}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            reason: e.target.value
                                        })
                                    }} />
                                {formDataErr === 'reason' && <span className="errorMsg">Please type a reason for your leave.</span>}
                            </div>
                            <div className="attachDocument">
                                <h3>Attach Document</h3>
                                <span>(optional)</span>
                                <input type="file"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            document: e.target.files[0]
                                        })
                                    }} />
                            </div>
                            <div className="actionButton">
                                <button className="cancel">Cancel</button>
                                <button className="Submit" type='submit' >Submit</button>
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