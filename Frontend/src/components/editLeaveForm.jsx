import { useState, useEffect } from 'react'
import axios from 'axios'

const leaveTypes = [
  'annual Leave',
  'sick Leave',
  'casual Leave',
  'paid Leave',
  'maternity Leave',
  'study Leave',
  'unpaid Leave',
  'volunteer Leave',
  'medical Leave',
  'halfday Leave',
]

function EditLeaveForm({ leave, onCancel}) {
  const [formData, setFormData] = useState(() => ({
    id: leave.id,
    title: leave.title,
    start: leave.start?.slice(0, 10),
    end: leave.end,
    endReal: (leave.endReal || leave.end)?.slice(0, 10),
    days: leave.days,
    reason: leave.reason,
    status: 'pending-leave'
  }))
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const start = formData.start ? new Date(`${formData.start}T00:00:00`) : null
    const end = formData.endReal ? new Date(`${formData.endReal}T00:00:00`) : null
    const newEnd = end.setDate(end.getDate() + 2)
    const newStrEnd = new Date(newEnd).toISOString().split('T')[0];

    if (!start || !end) {
      return
    }

    if (end < start) {
      setFormData((currentData) => ({ ...currentData, days: 0 }))
      return
    }

    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) - 1
    setFormData((currentData) => ({
      ...currentData,
      days: totalDays,
      end: newStrEnd,
    }))
  }, [formData.start, formData.endReal])

  function updateField(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
    setError('')
  }
  
  async function handleDelete() {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/delete-leave`,
        { id: leave.id },
        { withCredentials: true }
      )
      alert('Leave Deleted Successfully')
      setShowDeleteConfirm(false)
      onCancel?.()
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Something went wrong')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!formData.title?.trim()) {
      setError('Please select a leave type.')
      return
    }

    if (!formData.start) {
      setError('Please select a start date.')
      return
    }

    if (!formData.endReal) {
      setError('Please select an end date.')
      return
    }

    if (!formData.reason?.trim()) {
      setError('Please enter a reason for the leave.')
      return
    }

    const start = new Date(`${formData.start}T00:00:00`)
    const end = new Date(`${formData.endReal}T00:00:00`)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Please enter valid dates.')
      return
    }

    if (end < start) {
      setError('End date cannot be before the start date.')
      return
    }

    try {

      await axios.post( `${import.meta.env.VITE_BACKEND_URL}/user/edit-leave`, formData)
      alert('Leave Edited Successfully')
      onCancel?.()
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Something went wrong')
    }
  }

  const documentName = typeof leave.document === 'string'
    ? leave.document
    : leave.document?.name || ''

  return (
    <form className="editLeavePanel" onSubmit={handleSubmit}>
      <div className="editLeaveHeading">
        <div>
          <p className="detailsLabel">Leave Request</p>
          <h2>Edit Leave</h2>
        </div>
        <span className={`statusBadge ${leave.classNames?.[0]?.replace('-leave', '') || 'pending'}`}>
          {leave.classNames?.[0]?.replace('-leave', '') || 'pending'}
        </span>
      </div>

      <div className="editLeaveFields">
        {error && (
          <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{error}</p>
        )}

        <label>
          Leave Type
          <select name="title" value={formData.title} onChange={updateField}>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <div className="editLeaveDateFields">
          <label>
            Start Date
            <input name="start" type="date" value={formData.start} onChange={updateField} />
          </label>
          <label>
            End Date
            <input name="endReal" type="date" value={formData.endReal} onChange={updateField} />
          </label>
        </div>

        <label>
          Days
          <input name="days" type="number" value={formData.days || 0} readOnly aria-readonly="true" />
        </label>

        <label>
          Reason
          <textarea name="reason" rows="4" value={formData.reason} onChange={updateField} />
        </label>

        <div className="editLeaveAttachment">
          <span>Current attachment</span>
          <strong>{documentName || 'No attachment'}</strong>
        </div>
      </div>

      <div className="editLeaveActions">
        <button type="button" className="editLeaveDelete" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        <div>
          <button type="button" className="editLeaveCancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="editLeaveSave">Edit</button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="leaveDetailsBackdrop"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="deleteConfirmDialog"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="detailsLabel">Delete Leave</p>
            <h3>Are you sure you want to delete this leave?</h3>
            <div className="deleteConfirmActions">
              <button type="button" className="editLeaveCancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="editLeaveDelete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default EditLeaveForm