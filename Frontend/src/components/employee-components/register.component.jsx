import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase.config'
import { userContext } from '../../context/userContext'
import { useContext } from 'react'

const departments = [
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Information Technology', label: 'Information Technology' },
]

export default function EmployeeRegister({ roleSwitcher }) {
    const [showpass, setShowPass] = useState(false)
    const [showDepartment, setShowDepartment] = useState(false)
    const [signup, setSignup] = useState({
        userName: '',
        email: '',
        password: '',
        department: ''
    })
    const navigate = useNavigate()
    
    const { setLoginRole } = useContext(userContext)
    

    const handleFirebaseSignIn = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken()

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/firebase-exchange`,
                { idToken },
                { withCredentials: true }
            )

            setLoginRole('employee')
            
            navigate('/employee/dashboard')
        } catch (error) {
            console.error('Firebase sign-in failed', error)
            alert(error.response?.data?.message ?? 'Unable to sign in')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!showDepartment) {
            setShowDepartment(true)
            return
        }
        
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/register`,
                signup,
                { withCredentials: true }
            )
            setLoginRole('employee')
            navigate('/employee/dashboard')
        } catch (error) {
            console.error('Error submitting the employee registration form', error)
            alert(error.response?.data?.message ?? 'Unable to register user')
        }
    }

    return (
        <div className="loginPage">
            <header className="landingNavbar">
                <div className="left">
                    <div className="logo"></div>
                    <div className="brand-text">
                        <h1 className="name">LeaveManager</h1>
                        <p className="tagline">Smart leave approval for modern teams</p>
                    </div>
                </div>
            </header>

            <div className="registerContainer">
                {roleSwitcher}
                <div className="registerMain">
                    <span>Create your account</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {!showDepartment ? (
                        <>
                            <div className="userName">
                                <span>Full Name</span>
                                <input
                                    type="text"
                                    name="userName"
                                    value={signup.userName}
                                    required
                                    onChange={(event) => setSignup({ ...signup, userName: event.target.value })}
                                />
                            </div>

                            <div className="emailPas">
                                <span>Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={signup.email}
                                    required
                                    onChange={(event) => setSignup({ ...signup, email: event.target.value })}
                                />
                            </div>

                            <div className="passwordPass">
                                <span>Password</span>
                                <div className="password">
                                    <input
                                        type={showpass ? 'text' : 'password'}
                                        name="password"
                                        value={signup.password}
                                        required
                                        onChange={(event) => setSignup({ ...signup, password: event.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className={showpass ? 'showBtn show' : 'showBtn hide'}
                                        onClick={() => setShowPass(!showpass)}
                                    >
                                        {showpass
                                            ? <i className="fa-solid fa-eye-slash"></i>
                                            : <i className="fa-solid fa-eye"></i>
                                        }
                                    </button>
                                </div>
                            </div>

                            <div className="rememberMe">
                                <input type="checkbox" />
                                <span>Remember me on this device</span>
                            </div>
                        </>
                    ) : (
                        <div className="department">
                            <span>Department</span>
                            <select
                                name="department"
                                value={signup.department}
                                required
                                onChange={(event) => setSignup({ ...signup, department: event.target.value })}
                            >
                                <option value="" disabled>Select your department</option>
                                {departments.map((department) => (
                                    <option key={department.value} value={department.value}>
                                        {department.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={showDepartment ? 'registrationActions withBack' : 'registrationActions'}>
                        {showDepartment && (
                            <button
                                className="backBtn"
                                type="button"
                                onClick={() => setShowDepartment(false)}
                            >
                                Back
                            </button>
                        )}
                        <button className="signUpBtn" type="submit">
                            {showDepartment ? 'Create account' : 'Continue'}
                        </button>
                    </div>

                    {!showDepartment && (
                        <div className="otherOption">
                            <span>or sign up with</span>
                            <button
                                type="button"
                                onClick={() => handleFirebaseSignIn(new GoogleAuthProvider())}
                            >
                                <i className="fa-brands fa-google"></i> Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFirebaseSignIn(new GithubAuthProvider())}
                            >
                                <i className="fa-brands fa-github"></i> GitHub
                            </button>
                        </div>
                    )}

                    <footer>
                        <span>Have an account?</span>
                        <a href="/login">Login</a>
                    </footer>
                </form>
            </div>
        </div>
    )
}
