import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';   
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase.config';
import { userContext } from '../../context/userContext';
import { useContext } from 'react';

export default function EmployeeLogin({ roleSwitcher }){
    const [showpass, setShowPass] = useState(false)
    const [login, setlogin] = useState({
            email: '',
            password: ''
        })
    const { setLoginRole } = useContext(userContext)

    const navigate = useNavigate();   

    const handleFirebaseSignIn = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/firebase-exchange`,
                { idToken, photoURL: result.user.photoURL },
                { withCredentials: true }
            );

            setLoginRole('employee')

            navigate('/employee/dashboard');
        } catch (error) {
            console.error('Firebase sign-in failed', error);
            const messages = {
                'auth/popup-blocked': 'Allow popups and try GitHub sign-in again.',
                'auth/popup-closed-by-user': 'GitHub sign-in was cancelled.',
                'auth/account-exists-with-different-credential': 'This email is already used with another sign-in provider. Sign in with that provider first.',
                'auth/operation-not-allowed': 'GitHub sign-in is not enabled in Firebase Authentication.',
            }
            alert(error.response?.data?.message ?? messages[error.code] ?? error.message ?? 'Unable to sign in');
        }
    };

    const handleGoogle = () => handleFirebaseSignIn(new GoogleAuthProvider());
    const handleGitHub = () => {
        const githubProvider = new GithubAuthProvider();
        githubProvider.addScope('read:user');
        githubProvider.addScope('user:email');
        handleFirebaseSignIn(githubProvider);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/login`,
                login,
                { withCredentials: true }
            )
            setLoginRole('employee')
            navigate('/employee/dashboard');

        } catch (error) {
            console.log('error submitting the form', error)
            alert(error.response?.data?.message ?? 'Unable to login user')
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
                        <input type="text" name='email' value={login.email}
                        onChange={(e)=> 
                            setlogin({...login, email: e.target.value  })
                        }/>
                    </div>


                    <div className="passwordPass">

                        <div className="passAndForget">
                            <span>Password</span>
                            <a href="#reset">
                                Forgot your password?
                            </a>
                        </div>

                        <div className="password">

                            <input
                                type={showpass ? 'text' : 'password'} name='password' value={login.password}
                                onChange={(e)=> setlogin({...login, password: e.target.value})}
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


                    <button className="signInBtn">
                        Sign in
                    </button>


                    <div className="otherOption">

                        <span>or sign in with</span>

                        <button type="button" onClick={handleGoogle}>
                            <i className="fa-brands fa-google"></i>
                            Google
                        </button>

                        <button type="button" onClick={handleGitHub}>
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