import { useState } from 'react'
import './App.css'

// import LandingPage from './pages/landingPage'
// import Login from './pages/login.jsx'
// import Register from './pages/register'
// import EmployeeDashboa from './pages/dashboard'
// import EmployeeDashboard from './pages/employee/dashboard.employee'
// import ApplyLeaveEmployee from './pages/employee/applyLeave.employee'
// import MyLeaves from './pages/employee/myLeaves.employee'
import CalendarEmployee from './pages/employee/calendar.employee'

function App() {

  const [active, setActive] = useState('Dashboard')
  return (
    <>
      {/* <LandingPage /> */}
      {/* <Login /> */}
      {/* <Register/> */}
      {/* <EmployeeDashboard active={active} setActive={setActive} /> */}
      {/* <ApplyLeaveEmployee active={active} setActive={setActive} /> */}
      {/* <MyLeaves active={active} setActive={setActive} /> */}
      <CalendarEmployee active={active} setActive={setActive} />
    </>
  )
}

export default App
