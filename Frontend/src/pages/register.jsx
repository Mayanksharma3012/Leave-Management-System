import './register.css'
import { useState } from 'react'
import EmployeeRegister from '../components/employee-components/register.component'
import ManagerRegister from '../components/manager-components/register.component'

function Register() {
    const [activeRole, setActiveRole] = useState('employee')
    const roleSwitcher = (
        <div className="registerRoleSwitch" role="group" aria-label="Choose account type">
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
        ? <EmployeeRegister roleSwitcher={roleSwitcher} />
        : <ManagerRegister roleSwitcher={roleSwitcher} />
}

export default Register
