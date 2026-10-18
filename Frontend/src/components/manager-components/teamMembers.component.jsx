import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './teamMembers.component.css'

const leaveTypes = [
  { key: 'casual', label: 'Casual Leave (CL)', color: 'blue' },
  { key: 'sick', label: 'Sick Leave (SL)', color: 'purple' },
  { key: 'earned', label: 'Earned Leave (EL)', color: 'green' },
]

function TeamMemberDetails({ member, onClose }) {
  return (
    <div className="teamDetailsBackdrop" onClick={onClose}>
      <section
        className="teamDetailsDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-member-name"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="teamDetailsClose" type="button" onClick={onClose} aria-label="Close member details">
          ×
        </button>

        <header className="teamDetailsHeader">
          <span className={`teamAvatar teamAvatar-${member.color}`}>{member.initials}</span>
          <div>
            <h2 id="team-member-name">{member.name}</h2>
            <p>{member.id} <span aria-hidden="true">·</span> {member.department}</p>
            <a href={`mailto:${member.email}`}>{member.email}</a>
          </div>
        </header>

        <div className="teamDetailsContent">
          <section className="teamDetailCard">
            <div className="teamDetailTitle">
              <h3>Personal Information</h3>
              <span className="teamDetailIcon" aria-hidden="true">⌘</span>
            </div>
            <dl className="teamInfoList">
              <div><dt>Full Name</dt><dd>{member.name}</dd></div>
              <div><dt>Employee ID</dt><dd>{member.id}</dd></div>
              <div><dt>Department</dt><dd>{member.department}</dd></div>
              <div><dt>Position</dt><dd>{member.position}</dd></div>
              <div><dt>Joining Date</dt><dd>{member.joined}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${member.email}`}>{member.email}</a></dd></div>
              <div><dt>Phone</dt><dd>{member.phone}</dd></div>
            </dl>
          </section>

          <section className="teamDetailCard">
            <div className="teamDetailTitle">
              <h3>Leave Balance <span>(Current Year)</span></h3>
              <span className="teamDetailIcon" aria-hidden="true">▤</span>
            </div>
            <div className="teamLeaveBalances">
              {leaveTypes.map(({ key, label, color }) => {
                const [used, total] = member.balance[key]
                const remaining = total - used
                return (
                  <div className="teamBalanceItem" key={key}>
                    <div className="teamBalanceLabel">
                      <span>{label}</span>
                      <span>{remaining} / {total} days</span>
                    </div>
                    <div className="teamBalanceTrack">
                      <span className={`teamBalanceFill teamBalanceFill-${color}`} style={{ width: `${(remaining / total) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="teamDetailCard teamCurrentStatus">
            <div className="teamDetailTitle">
              <h3>Current Status</h3>
              <span className={`teamStatusBadge ${member.status === 'Present' ? 'isPresent' : 'isAway'}`}>
                <span aria-hidden="true" />{member.status}{member.status === 'Present' ? ' Today' : ''}
              </span>
            </div>
            <p>Last login: {member.lastLogin}</p>
          </section>

          <section className="teamDetailCard">
            <div className="teamDetailTitle">
              <h3>Recent Leaves</h3>
            </div>
            <ul className="teamRecentLeaves">
              {member.recentLeaves.map((leave) => (
                <li key={`${leave.type}-${leave.date}`}>
                  <span>{leave.type}<small>{leave.days}</small></span>
                  <span>{leave.date}</span>
                  <span className="teamLeaveApproved">{leave.status}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="teamManagerNote">
            <h3>Manager Notes</h3>
            <p>{member.note}</p>
          </section>
        </div>
      </section>
    </div>
  )
}

function AddTeamMemberDialog({ members, onClose, onAdd }) {
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [addError, setAddError] = useState('')
  const [addingEmployeeId, setAddingEmployeeId] = useState('')

  useEffect(() => {
    let isActive = true

    const loadAvailableEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/manager/availableemployee`,
          { withCredentials: true },
        )
        if (!Array.isArray(response.data.employees)) {
          throw new Error('The server returned an invalid employee list.')
        }
        if (isActive) setEmployees(response.data.employees)
      } catch (error) {
        if (isActive) {
          setLoadError(error.response?.data?.message || error.message || 'Unable to load available employees.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadAvailableEmployees()
    return () => {
      isActive = false
    }
  }, [])

  const searchTerm = search.trim().toLowerCase()
  const availableMembers = employees
    .map((employee) => {
      const name = employee.userName || employee.name || employee.email
      return {
        ...employee,
        id: employee.employeeId || employee._id,
        name,
        department: employee.department || 'Not specified',
        position: employee.position || 'Employee',
        initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
        color: 'blue',
        phone: employee.phone || 'Not provided',
        joined: employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'Not available',
        status: 'Present',
        balance: { casual: [0, 12], sick: [0, 12], earned: [0, 18] },
        recentLeaves: [],
        note: '',
        lastLogin: 'Not available',
      }
    })
    .filter((employee) => (
      employee.id
      && !members.some((member) => member.id === employee.id)
      && (!searchTerm || [employee.id, employee.name, employee.email]
        .some((value) => value?.toLowerCase().includes(searchTerm)))
    ))

  const handleAdd = async (employee) => {
    setAddError('')
    setAddingEmployeeId(employee.id)

    try {
      await onAdd(employee)
    } catch (error) {
      setAddError(error.response?.data?.message || error.message || 'Unable to add employee.')
    } finally {
      setAddingEmployeeId('')
    }
  }

  return (
    <div className="teamDetailsBackdrop" onClick={onClose}>
      <section
        className="teamAddDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-team-member-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="teamDetailsClose" type="button" onClick={onClose} aria-label="Close add team member dialog">
          ×
        </button>
        <h2 id="add-team-member-title">Add team member</h2>
        <p className="teamAddDescription">Search employees by name, employee ID, or email address.</p>
        <label className="teamAddSearch">
          <span aria-hidden="true">⌕</span>
          <input
            autoFocus
            type="search"
            placeholder="Search by name, ID, or email..."
            aria-label="Search employees by name, employee ID, or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="teamAddResults" aria-live="polite">
          {isLoading ? (
            <p className="teamAddEmpty">Loading available employees…</p>
          ) : loadError ? (
            <p className="teamAddEmpty" role="alert">{loadError}</p>
          ) : availableMembers.length ? availableMembers.map((employee) => (
            <div className="teamAddResult" key={employee.id}>
              <span className={`teamAvatar teamAvatar-${employee.color}`}>{employee.initials}</span>
              <span className="teamAddResultInfo">
                <strong>{employee.name}</strong>
                <small>{employee.id} <span aria-hidden="true">·</span> {employee.email} <span aria-hidden="true">·</span> {employee.department}</small>
              </span>
              <button
                className="teamAddResultButton"
                type="button"
                disabled={Boolean(addingEmployeeId)}
                onClick={() => handleAdd(employee)}
              >
                {addingEmployeeId === employee.id ? 'Adding…' : 'Add'}
              </button>
            </div>
          )) : (
            <p className="teamAddEmpty">
              {searchTerm ? 'No available employees match your search.' : employees.length ? 'All available employees are already on your team.' : 'No available employees found.'}
            </p>
          )}
          {addError && <p className="teamAddEmpty" role="alert">{addError}</p>}
        </div>
        <div className="teamAddFooter">
          <button className="teamResetButton" type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  )
}

export default function TeamMembers() {
  const [members, setMembers] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [membersError, setMembersError] = useState('')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [leaveStatus, setLeaveStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const pageSize = 8

  useEffect(() => {
    let isActive = true

    const fetchManagerEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/manager/employees`,
          { withCredentials: true },
        )
        if (!Array.isArray(response.data.employees)) {
          throw new Error('The server returned an invalid employee list.')
        }

        if (isActive) {
          setMembers(response.data.employees.map((employee) => {
            const name = employee.userName || employee.email || 'Employee'
            return {
              ...employee,
              id: employee._id,
              name,
              department: employee.department || 'Not specified',
              position: employee.position || 'Employee',
              initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
              color: 'blue',
              phone: employee.phone || 'Not provided',
              joined: employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'Not available',
              status: 'Present',
              balance: { casual: [0, 12], sick: [0, 12], earned: [0, 18] },
              recentLeaves: [],
              note: '',
              lastLogin: 'Not available',
            }
          }))
        }
      } catch (error) {
        if (isActive) {
          setMembersError(error.response?.data?.message || error.message || 'Unable to load team members.')
        }
      } finally {
        if (isActive) setIsLoadingMembers(false)
      }
    }

    fetchManagerEmployees()
    return () => {
      isActive = false
    }
  }, [])

  const departments = useMemo(
    () => [...new Set(members.map((member) => member.department))].sort(),
    [members],
  )

  const filteredMembers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesSearch = !searchTerm || [
        member.name,
        member.id,
        member.department,
        member.position,
      ].some((value) => value.toLowerCase().includes(searchTerm))
      const matchesDepartment = !department || member.department === department
      const matchesStatus = !status || member.status === status
      const matchesLeaveStatus = !leaveStatus
        || (leaveStatus === 'on-leave' ? member.status === 'On Leave' : member.status === 'Present')
      return matchesSearch && matchesDepartment && matchesStatus && matchesLeaveStatus
    })
  }, [members, search, department, status, leaveStatus])

  const pageCount = Math.ceil(filteredMembers.length / pageSize)
  const pageMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const firstVisibleMember = filteredMembers.length ? (currentPage - 1) * pageSize + 1 : 0
  const lastVisibleMember = Math.min(currentPage * pageSize, filteredMembers.length)

  const presentCount = members.filter((member) => member.status === 'Present').length
  const leaveCount = members.length - presentCount
  const summary = [
    { label: 'Total Members', value: members.length, note: 'Across your team', tone: 'members', icon: '♙' },
    { label: 'Present Today', value: presentCount, note: `${members.length ? Math.round((presentCount / members.length) * 100) : 0}% of team`, tone: 'present', icon: '✓' },
    { label: 'On Leave Today', value: leaveCount, note: `${members.length ? Math.round((leaveCount / members.length) * 100) : 0}% of team`, tone: 'leave', icon: '↗' },
    { label: 'Departments', value: departments.length, note: departments.join(', '), tone: 'departments', icon: '⌘' },
  ]

  const exportTeamList = () => {
    const rows = [
      ['Employee', 'Employee ID', 'Department', 'Position', 'Status', 'Email'],
      ...filteredMembers.map((member) => [
        member.name,
        member.id,
        member.department,
        member.position,
        member.status,
        member.email,
      ]),
    ]
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
    const downloadUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'team-members.csv'
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  const addTeamMember = async (member) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/manager/addemployee`,
      { id: member.id },
      { withCredentials: true },
    )

    const employee = response.data.employee
    setMembers((currentMembers) => [
      ...currentMembers,
      {
        ...member,
        id: employee.id,
        name: employee.userName,
        email: employee.email,
      },
    ])
    setCurrentPage(1)
    setIsAddDialogOpen(false)
  }

  return (
    <section className="teamRoster" aria-label="Team members">
      <div className="teamSummaryGrid">
        {summary.map((item) => (
          <article className={`teamSummaryCard teamSummary-${item.tone}`} key={item.label}>
            <span className="teamSummaryIcon" aria-hidden="true">{item.icon}</span>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </div>
          </article>
        ))}
      </div>

      <section className="teamTablePanel">
        <div className="teamTableHeading">
          <div>
            <h2>Team members</h2>
            <p>Browse your team and view individual leave information.</p>
          </div>
          <div className="teamTableActions">
            <button className="teamAddButton" type="button" onClick={() => setIsAddDialogOpen(true)}>
              <span aria-hidden="true">＋</span> Add member
            </button>
            <button className="teamExportButton" type="button" onClick={exportTeamList}>
              <span aria-hidden="true">⇩</span> Export Team List
            </button>
          </div>
        </div>
        {membersError && <p className="teamAddEmpty" role="alert">{membersError}</p>}

        <div className="teamFilters">
          <label className="teamSearch">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by name, ID, department..."
              aria-label="Search team members"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
            />
          </label>
          <select aria-label="Filter by department" value={department} onChange={(event) => {
            setDepartment(event.target.value)
            setCurrentPage(1)
          }}>
            <option value="">All departments</option>
            {departments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by current status" value={status} onChange={(event) => {
            setStatus(event.target.value)
            setCurrentPage(1)
          }}>
            <option value="">All statuses</option>
            <option value="Present">Present</option>
            <option value="On Leave">On Leave</option>
          </select>
          <select aria-label="Filter by leave status" value={leaveStatus} onChange={(event) => {
            setLeaveStatus(event.target.value)
            setCurrentPage(1)
          }}>
            <option value="">Leave status</option>
            <option value="present">Available</option>
            <option value="on-leave">On leave</option>
          </select>
          <button
            className="teamResetButton"
            type="button"
            onClick={() => {
              setSearch('')
              setDepartment('')
              setStatus('')
              setLeaveStatus('')
              setCurrentPage(1)
            }}
          >
            Reset
          </button>
        </div>

        <div className="teamTableScroll">
          <table className="teamTable">
            <thead>
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Department</th>
                <th scope="col">Position</th>
                <th scope="col">Leave Balance <span aria-hidden="true">ⓘ</span></th>
                <th scope="col">Current Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingMembers && (
                <tr><td className="teamEmptyState" colSpan="6">Loading team members…</td></tr>
              )}
              {pageMembers.map((member) => (
                <tr key={member.id} onClick={() => setSelectedMember(member)} tabIndex="0" onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedMember(member)
                  }
                }}>
                  <td>
                    <div className="teamEmployeeCell">
                      <span className={`teamAvatar teamAvatar-${member.color}`}>{member.initials}</span>
                      <span><strong>{member.name}</strong><small>{member.id}</small></span>
                    </div>
                  </td>
                  <td>{member.department}</td>
                  <td>{member.position}</td>
                  <td>
                    <div className="teamLeaveChips">
                      {leaveTypes.map(({ key, label }) => (
                        <span key={key} title={label}>{key.slice(0, 2).toUpperCase()}<strong>{member.balance[key][1] - member.balance[key][0]}</strong></span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`teamStatusBadge ${member.status === 'Present' ? 'isPresent' : 'isAway'}`}>
                      <span aria-hidden="true" />{member.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="teamRowAction"
                      type="button"
                      aria-label={`View ${member.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedMember(member)
                      }}
                    >
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoadingMembers && filteredMembers.length === 0 && (
                <tr><td className="teamEmptyState" colSpan="6">
                  {members.length ? 'No team members match these filters.' : 'No employees have been added to your team yet.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="teamTableFooter">
          <span>Showing {firstVisibleMember}–{lastVisibleMember} of {filteredMembers.length} employees</span>
          <nav className="teamPagination" aria-label="Team member pages">
            <button
              type="button"
              disabled={currentPage === 1}
              aria-label="Previous page"
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                className={page === currentPage ? 'isCurrentPage' : ''}
                type="button"
                key={page}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === pageCount || pageCount === 0}
              aria-label="Next page"
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              ›
            </button>
          </nav>
        </footer>
      </section>

      {isAddDialogOpen && (
        <AddTeamMemberDialog
          members={members}
          onAdd={addTeamMember}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}
      {selectedMember && <TeamMemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </section>
  )
}
