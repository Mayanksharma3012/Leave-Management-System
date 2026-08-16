import { useEffect, useState } from 'react'
import './App.css'

import LandingPage from './pages/landingPage'
import Login from './pages/login.jsx'
import Register from './pages/register'
// import EmployeeDashboa from './pages/dashboard'
import EmployeeDashboard from './pages/employee/dashboard.employee'
import ApplyLeaveEmployee from './pages/employee/applyLeave.employee'
import MyLeaves from './pages/employee/myLeaves.employee'
import CalendarEmployee from './pages/employee/calendar.employee'
import EmployeeSettings from './pages/employee/settings.employee'

const THEME_STORAGE_KEY = 'leave-manager-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [active, setActive] = useState('Dashboard')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const resolvedTheme = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme

      root.setAttribute('data-theme', resolvedTheme)
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }

    applyTheme()

    if (theme !== 'system') {
      return undefined
    }

    const handleSystemThemeChange = () => applyTheme()
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  return (
    <>
      {/* <LandingPage /> */}
      {/* <Login /> */}
      {/* <Register/> */}
      {/* <EmployeeDashboard active={active} setActive={setActive} /> */}
      {/* <ApplyLeaveEmployee active={active} setActive={setActive} /> */}
      {/* <MyLeaves active={active} setActive={setActive} /> */}
      {/* <CalendarEmployee active={active} setActive={setActive} /> */}
      <EmployeeSettings active={active} setActive={setActive} theme={theme} setTheme={setTheme} />
    </>
  )
}

export default App
