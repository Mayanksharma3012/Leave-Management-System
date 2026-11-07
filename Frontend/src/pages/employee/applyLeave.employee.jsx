import './applyLeave.employee.css'
import Sidebar from '../../components/sidebar'
import Navbar from '../../components/header'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import holidayData from '../../assets/holiday.json'

const getTodayDate = () => {
    const today = new Date()
    const offset = today.getTimezoneOffset() * 60 * 1000
    return new Date(today.getTime() - offset).toISOString().split('T')[0]
}

function ApplyLeaveEmployee({submitedFormData ,}) {

    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        document: null
    })
    const [formDataErr, setFormDataErr] = useState('')
    const [totalDays, setTotalDays] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef(null)
    const isSubmittingRef = useRef(false)
    const today = getTodayDate()

    useEffect(() => {
        if (!formData.startDate || !formData.endDate) {
            setTotalDays(0)
            return
        }

        const start = Date.parse(`${formData.startDate}T00:00:00Z`)
        const end = Date.parse(`${formData.endDate}T00:00:00Z`)
        setTotalDays(end >= start ? Math.round((end - start) / 86400000) + 1 : 0)
    }, [formData.startDate, formData.endDate])

    async function checkFormData(e) {
        e.preventDefault()
        if (isSubmittingRef.current) return

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
        const start = new Date(`${formData.startDate}T00:00:00`)
        const end = new Date(`${formData.endDate}T00:00:00`)
        const todayDate = new Date(`${today}T00:00:00`)
        
        if (start < todayDate) {
            setFormDataErr('pastDate')
            return
        }

        if (end < start) {
            // invalid date range
            setFormDataErr('invalidDate')
            return
        }

        const newEnd = end.setDate(end.getDate() + 1)
        const newStrEnd = new Date(newEnd).toISOString().split('T')[0];

        const leavePayload = new FormData()
        leavePayload.append('title', formData.leaveType)
        leavePayload.append('start', formData.startDate)
        leavePayload.append('end', newStrEnd)
        leavePayload.append('endReal', formData.endDate)
        leavePayload.append('classNames', JSON.stringify(['pending-leave']))
        leavePayload.append('reason', formData.reason)
        leavePayload.append('days', String(totalDays))

        if (formData.document) {
            leavePayload.append('document', formData.document, formData.document.name)
        }

        isSubmittingRef.current = true
        setIsSubmitting(true)
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/applyleave`,
                leavePayload,
                { withCredentials: true }
            )
            formRef.current?.reset()
            setFormData({
                leaveType: '',
                startDate: '',
                endDate: '',
                reason: '',
                document: null
            })
            setFormDataErr('')
            alert('Leave applied successfully')
        } catch (error) {
            console.log('error submitting the form', error)
            alert(error.response?.data?.message ?? 'Error submitting the form')
        } finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }

    }
    const [balances, setbalances] = useState([
        { label: 'Casual', days: '12 days' },
        { label: 'Sick', days: '8 days' },
        { label: 'Paid', days: '15 days' },
    ])
    
    useEffect(() => {
        let ignore = false

        async function fetchBalance() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/leavebalance`, { withCredentials: true })
                if (ignore) return
                const balance = response.data.leaveBalance
                setbalances([
                    { label: 'Casual', days: `${balance.casualLeave} days` },
                    { label: 'Sick', days: `${balance.sickLeave} days` },
                    { label: 'Earned', days: `${balance.earnedLeave} days` },
                ])
            } catch (error) {
                console.log(error)
            }
        }

        fetchBalance()
        return () => { ignore = true }
    }, [])


    const upcomingHolidays = holidayData
        .filter((holiday) => holiday.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 2)
        .map((holiday) => ({
            ...holiday,
            displayDate: new Date(`${holiday.date}T00:00:00`).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }))

    return (
        <>
            <div className="employeeLeavePage">
                <Sidebar />
                <main className="employeeLeaveMain container">
                    <Navbar />
                    <section className='leaveMain'>

                        <form ref={formRef} className="applyLeave" onSubmit={checkFormData} encType='multipart/form-data'>
                            <h2>Leave Request</h2>
                            <span>Leave Type</span>
                            <select name="LeaveType" id="LeaveTypes" value={formData.leaveType}
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
                                <option value="earned Leave">Earned Leave</option>
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
                                    <input id='sDate' type="date" min={today} value={formData.startDate} name='startDate'
                                        onChange={(e) => {
                                            const startDate = e.target.value
                                            setFormData((current) => ({
                                                ...current,
                                                startDate,
                                                endDate: current.endDate && current.endDate < startDate ? '' : current.endDate
                                            }))
                                        }} />
                                    <span>Start Date</span>
                                    {formDataErr === 'startDate' && <span className="errorMsg">Please select a start date for your leave.</span>}
                                    {formDataErr === 'pastDate' && <span className="errorMsg">Start date cannot be before today.</span>}
                                </div>
                                <div className="endDate">
                                    <input type="date" id='eDate' min={formData.startDate || today} value={formData.endDate} name='endDate'
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
                                <input type="file" name='document' accept="image/*,.pdf"
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            document: e.target.files[0]
                                        })
                                    }} />
                            </div>
                            <div className="actionButton">
                                <button className="cancel" type="button" disabled={isSubmitting}>Cancel</button>
                                <button className="Submit" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Uploading...' : 'Submit'}
                                </button>
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
                                    {upcomingHolidays.map((item) => (
                                        <li key={item.date} className="holidayItem">
                                            <span className="holidayDate">{item.displayDate}</span>
                                            <span>{item.name}</span>
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