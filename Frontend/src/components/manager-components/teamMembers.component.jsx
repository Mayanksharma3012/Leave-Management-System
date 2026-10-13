import { useMemo, useState } from 'react'
import './teamMembers.component.css'

const teamMembers = [
  {
    id: 'EMP-1024',
    name: 'Rahul Sharma',
    department: 'Engineering',
    position: 'Software Developer',
    email: 'rahul.sharma@company.com',
    phone: '+91 98765 43210',
    joined: '10 Jan 2024',
    status: 'Present',
    initials: 'RS',
    color: 'blue',
    balance: { casual: [6, 12], sick: [8, 12], earned: [12, 18] },
    recentLeaves: [
      { type: 'Casual leave', days: '2 days', date: '5 – 6 Sep 2024', status: 'Approved' },
      { type: 'Sick leave', days: '1 day', date: '14 Aug 2024', status: 'Approved' },
      { type: 'Earned leave', days: '3 days', date: '21 – 23 Jul 2024', status: 'Approved' },
    ],
    note: 'Consistently delivers good work. Reliable team member.',
    lastLogin: '11 Oct 2024, 09:15 AM',
  },
  {
    id: 'EMP-1025',
    name: 'Priya Patel',
    department: 'Design',
    position: 'UI/UX Designer',
    email: 'priya.patel@company.com',
    phone: '+91 98765 43211',
    joined: '18 Mar 2024',
    status: 'On Leave',
    initials: 'PP',
    color: 'pink',
    balance: { casual: [4, 12], sick: [10, 12], earned: [15, 18] },
    recentLeaves: [
      { type: 'Casual leave', days: '2 days', date: '12 – 13 Oct 2024', status: 'Approved' },
      { type: 'Earned leave', days: '1 day', date: '24 Aug 2024', status: 'Approved' },
    ],
    note: 'Brings thoughtful ideas and a strong eye for detail.',
    lastLogin: '10 Oct 2024, 05:42 PM',
  },
  {
    id: 'EMP-1026',
    name: 'Amit Verma',
    department: 'Marketing',
    position: 'Marketing Executive',
    email: 'amit.verma@company.com',
    phone: '+91 98765 43212',
    joined: '02 Feb 2023',
    status: 'Present',
    initials: 'AV',
    color: 'purple',
    balance: { casual: [7, 12], sick: [9, 12], earned: [10, 18] },
    recentLeaves: [{ type: 'Sick leave', days: '1 day', date: '2 Sep 2024', status: 'Approved' }],
    note: 'A dependable collaborator across the marketing team.',
    lastLogin: '11 Oct 2024, 09:02 AM',
  },
  {
    id: 'EMP-1027',
    name: 'Sneha Choudhary',
    department: 'HR',
    position: 'HR Executive',
    email: 'sneha.choudhary@company.com',
    phone: '+91 98765 43213',
    joined: '15 Jun 2023',
    status: 'Present',
    initials: 'SC',
    color: 'teal',
    balance: { casual: [8, 12], sick: [10, 12], earned: [14, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '1 day', date: '19 Aug 2024', status: 'Approved' }],
    note: 'Supports the team with care and clear communication.',
    lastLogin: '11 Oct 2024, 08:56 AM',
  },
  {
    id: 'EMP-1028',
    name: 'Deepak Kumar',
    department: 'Engineering',
    position: 'Backend Developer',
    email: 'deepak.kumar@company.com',
    phone: '+91 98765 43214',
    joined: '21 Nov 2022',
    status: 'On Leave',
    initials: 'DK',
    color: 'orange',
    balance: { casual: [5, 12], sick: [7, 12], earned: [11, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '1 day', date: 'Today', status: 'Approved' }],
    note: 'Strong problem solver and a generous teammate.',
    lastLogin: '10 Oct 2024, 06:11 PM',
  },
  {
    id: 'EMP-1029',
    name: 'Neha Tiwari',
    department: 'Product',
    position: 'Product Manager',
    email: 'neha.tiwari@company.com',
    phone: '+91 98765 43215',
    joined: '08 Apr 2022',
    status: 'Present',
    initials: 'NT',
    color: 'amber',
    balance: { casual: [6, 12], sick: [9, 12], earned: [12, 18] },
    recentLeaves: [{ type: 'Earned leave', days: '2 days', date: '17 – 18 Jun 2024', status: 'Approved' }],
    note: 'Keeps product work focused and moving forward.',
    lastLogin: '11 Oct 2024, 09:10 AM',
  },
  {
    id: 'EMP-1030',
    name: 'Vikram Singh',
    department: 'Design',
    position: 'Graphic Designer',
    email: 'vikram.singh@company.com',
    phone: '+91 98765 43216',
    joined: '04 Dec 2023',
    status: 'On Leave',
    initials: 'VK',
    color: 'violet',
    balance: { casual: [4, 12], sick: [8, 12], earned: [8, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '3 days', date: '14 – 16 Oct 2024', status: 'Approved' }],
    note: 'Creates polished, consistent work for every project.',
    lastLogin: '10 Oct 2024, 04:34 PM',
  },
  {
    id: 'EMP-1031',
    name: 'Isha Agarwal',
    department: 'QA',
    position: 'QA Engineer',
    email: 'isha.agarwal@company.com',
    phone: '+91 98765 43217',
    joined: '28 Jul 2023',
    status: 'Present',
    initials: 'IA',
    color: 'green',
    balance: { casual: [7, 12], sick: [10, 12], earned: [15, 18] },
    recentLeaves: [{ type: 'Sick leave', days: '1 day', date: '3 Jul 2024', status: 'Approved' }],
    note: 'Thorough and proactive in keeping releases reliable.',
    lastLogin: '11 Oct 2024, 08:48 AM',
  },
  {
    id: 'EMP-1032',
    name: 'Karan Rajput',
    department: 'Engineering',
    position: 'Frontend Developer',
    email: 'karan.rajput@company.com',
    phone: '+91 98765 43218',
    joined: '11 Jan 2024',
    status: 'Present',
    initials: 'KR',
    color: 'sky',
    balance: { casual: [5, 12], sick: [6, 12], earned: [12, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '2 days', date: '9 – 10 Aug 2024', status: 'Approved' }],
    note: 'Quick to learn and eager to help teammates.',
    lastLogin: '11 Oct 2024, 09:18 AM',
  },
  {
    id: 'EMP-1033',
    name: 'Meera Sethi',
    department: 'HR',
    position: 'HR Manager',
    email: 'meera.sethi@company.com',
    phone: '+91 98765 43219',
    joined: '03 May 2021',
    status: 'Present',
    initials: 'MS',
    color: 'purple',
    balance: { casual: [8, 12], sick: [9, 12], earned: [14, 18] },
    recentLeaves: [{ type: 'Earned leave', days: '2 days', date: '1 – 2 Aug 2024', status: 'Approved' }],
    note: 'A steady, supportive leader for the HR team.',
    lastLogin: '11 Oct 2024, 09:05 AM',
  },
  {
    id: 'EMP-1034',
    name: 'Arjun Mehta',
    department: 'Product',
    position: 'Product Analyst',
    email: 'arjun.mehta@company.com',
    phone: '+91 98765 43220',
    joined: '17 Aug 2023',
    status: 'Present',
    initials: 'AM',
    color: 'blue',
    balance: { casual: [9, 12], sick: [11, 12], earned: [14, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '1 day', date: '16 Sep 2024', status: 'Approved' }],
    note: 'Uses data and clear communication to support product decisions.',
    lastLogin: '11 Oct 2024, 09:12 AM',
  },
  {
    id: 'EMP-1035',
    name: 'Kavya Nair',
    department: 'Marketing',
    position: 'Content Strategist',
    email: 'kavya.nair@company.com',
    phone: '+91 98765 43221',
    joined: '06 Feb 2024',
    status: 'On Leave',
    initials: 'KN',
    color: 'pink',
    balance: { casual: [5, 12], sick: [10, 12], earned: [13, 18] },
    recentLeaves: [{ type: 'Earned leave', days: '2 days', date: '12 – 13 Oct 2024', status: 'Approved' }],
    note: 'Brings a fresh perspective to the team’s campaigns.',
    lastLogin: '10 Oct 2024, 05:26 PM',
  },
  {
    id: 'EMP-1036',
    name: 'Rohan Desai',
    department: 'Engineering',
    position: 'DevOps Engineer',
    email: 'rohan.desai@company.com',
    phone: '+91 98765 43222',
    joined: '22 Sep 2022',
    status: 'Present',
    initials: 'RD',
    color: 'teal',
    balance: { casual: [6, 12], sick: [8, 12], earned: [10, 18] },
    recentLeaves: [{ type: 'Sick leave', days: '1 day', date: '7 Aug 2024', status: 'Approved' }],
    note: 'Keeps infrastructure dependable and helps unblock others.',
    lastLogin: '11 Oct 2024, 08:52 AM',
  },
  {
    id: 'EMP-1037',
    name: 'Ananya Bose',
    department: 'Design',
    position: 'Product Designer',
    email: 'ananya.bose@company.com',
    phone: '+91 98765 43223',
    joined: '13 Mar 2023',
    status: 'Present',
    initials: 'AB',
    color: 'amber',
    balance: { casual: [7, 12], sick: [12, 12], earned: [16, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '2 days', date: '20 – 21 Jun 2024', status: 'Approved' }],
    note: 'Thoughtful in balancing user needs with practical design.',
    lastLogin: '11 Oct 2024, 09:08 AM',
  },
  {
    id: 'EMP-1038',
    name: 'Sahil Gupta',
    department: 'QA',
    position: 'QA Analyst',
    email: 'sahil.gupta@company.com',
    phone: '+91 98765 43224',
    joined: '30 May 2024',
    status: 'Present',
    initials: 'SG',
    color: 'orange',
    balance: { casual: [10, 12], sick: [11, 12], earned: [17, 18] },
    recentLeaves: [{ type: 'Casual leave', days: '1 day', date: '11 Jul 2024', status: 'Approved' }],
    note: 'Careful and systematic when testing new releases.',
    lastLogin: '11 Oct 2024, 09:20 AM',
  },
]

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

export default function TeamMembers() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [leaveStatus, setLeaveStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMember, setSelectedMember] = useState(null)
  const pageSize = 8

  const departments = useMemo(
    () => [...new Set(teamMembers.map((member) => member.department))].sort(),
    [],
  )

  const filteredMembers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    return teamMembers.filter((member) => {
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
  }, [search, department, status, leaveStatus])

  const pageCount = Math.ceil(filteredMembers.length / pageSize)
  const pageMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const firstVisibleMember = filteredMembers.length ? (currentPage - 1) * pageSize + 1 : 0
  const lastVisibleMember = Math.min(currentPage * pageSize, filteredMembers.length)

  const presentCount = teamMembers.filter((member) => member.status === 'Present').length
  const leaveCount = teamMembers.length - presentCount
  const summary = [
    { label: 'Total Members', value: teamMembers.length, note: 'Across your team', tone: 'members', icon: '♙' },
    { label: 'Present Today', value: presentCount, note: `${Math.round((presentCount / teamMembers.length) * 100)}% of team`, tone: 'present', icon: '✓' },
    { label: 'On Leave Today', value: leaveCount, note: `${Math.round((leaveCount / teamMembers.length) * 100)}% of team`, tone: 'leave', icon: '↗' },
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
          <button className="teamExportButton" type="button" onClick={exportTeamList}>
            <span aria-hidden="true">＋</span> Export Team List
          </button>
        </div>

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
              {filteredMembers.length === 0 && (
                <tr><td className="teamEmptyState" colSpan="6">No team members match these filters.</td></tr>
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

      {selectedMember && <TeamMemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </section>
  )
}
