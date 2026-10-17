import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase.config'
import { useContext } from 'react'
import { userContext } from '../../context/userContext'

export default function ManagerLogin({ roleSwitcher }) {
    const [showpass, setShowPass] = useState(false)
    const [login, setLogin] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const { setLoginRole } = useContext(userContext)
    
    const handleFirebaseSignIn = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider)
            const idToken = await result.user.getIdToken()
            
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/manager/firebase-exchange`,
                { idToken },
                { withCredentials: true }
            )
            setLoginRole('manager')
            
            navigate('/manager/dashboard')
        } catch (error) {
            console.error('Manager Firebase sign-in failed', error)
            alert(error.response?.data?.message ?? 'Unable to sign in')
        }
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/manager/login`,
                login,
                { withCredentials: true }
            )
            setLoginRole('manager')
            navigate('/manager/dashboard')
        } catch (error) {
            console.error('Error submitting the manager login form', error)
            alert(error.response?.data?.message ?? 'Unable to login manager')
        }
    }

    return (
        <div className="loginPage">
            <header className="loginNavbar">
                <div className="loginNavbarLeft">
                    <div className="loginLogo"></div>
                    <div className="loginBrand">
                        <h1>LeaveManager</h1>
                        <p>Smart leave approval for modern teams</p>
                    </div>
                </div>
            </header>

            <div className="loginContainer">
                {roleSwitcher}

                <div className="loginMain">
                    <span>Sign in to your account</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="emailPas">
                        <span>Email</span>
                        <input
                            type="text"
                            name="email"
                            value={login.email}
                            onChange={(event) => setLogin({ ...login, email: event.target.value })}
                        />
                    </div>

                    <div className="passwordPass">
                        <div className="passAndForget">
                            <span>Password</span>
                            <a href="#reset">Forgot your password?</a>
                        </div>

                        <div className="password">
                            <input
                                type={showpass ? 'text' : 'password'}
                                name="password"
                                value={login.password}
                                onChange={(event) => setLogin({ ...login, password: event.target.value })}
                            />
                            <button
                                type="button"
                                className="showBtn"
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

                    <button className="signInBtn">Sign in</button>

                    <div className="otherOption">
                        <span>or sign in with</span>
                        <button
                            type="button"
                            onClick={() => handleFirebaseSignIn(new GoogleAuthProvider())}
                        >
                            <i className="fa-brands fa-google"></i>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFirebaseSignIn(new GithubAuthProvider())}
                        >
                            <i className="fa-brands fa-github"></i>
                            GitHub
                        </button>
                    </div>

                    <footer>
                        <span>Don't have an account?</span>
                        <a href="/register">Create an account</a>
                    </footer>
                </form>
            </div>
        </div>
    )
}
