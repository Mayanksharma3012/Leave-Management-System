import './login.css'
import { useState } from 'react'
import EmployeeLogin from '../components/employee-components/login.component'
import ManagerLogin from '../components/manager-components/login.component'

function Login() {
    const [activeRole, setActiveRole] = useState('employee')
    const roleSwitcher = (
        <div className="loginRoleSwitch" role="group" aria-label="Choose account type">
            <button
                type="button"
                className={activeRole === 'employee' ? 'active' : ''}
                aria-pressed={activeRole === 'employee'}
                onClick={() => setActiveRole('employee')}
            >
                Employee
            </button>
            <button
                type="button"
                className={activeRole === 'manager' ? 'active' : ''}
                aria-pressed={activeRole === 'manager'}
                onClick={() => setActiveRole('manager')}
            >
                Manager
            </button>
        </div>
    )

    return activeRole === 'employee'
        ? <EmployeeLogin roleSwitcher={roleSwitcher} />
        : <ManagerLogin roleSwitcher={roleSwitcher} />
}

export default Login