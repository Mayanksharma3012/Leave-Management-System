import './register.css'
import { useState } from 'react';

function Register() {
    const [showpass, setShowPass] = useState(false)

    return (
        <>
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
                <div className="registerMain">
                    <span>Create your account</span>
                </div>

                <form>
                    <div className="emailPas">
                        <span>Email</span>
                        <input type="email" />
                    </div>

                    <div className="passwordPass">
                        <span>Password</span>
                        <div className="password">
                            <input type={showpass ? 'text' : 'password'} />
                            <button
                                type="button"
                                className={showpass ? 'showBtn show' : 'showBtn hide'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPass(!showpass);
                                }}
                            >
                                {showpass ? (<i className="fa-solid fa-eye-slash"></i>) : (<i className="fa-solid fa-eye"></i>)}
                            </button>
                        </div>
                    </div>

                    <div className="rememberMe">
                        <input type="checkbox" />
                        <span>Remember me on this device</span>
                    </div>

                    <button className='signUpBtn'>Sign up</button>

                    <div className="otherOption">
                        <span>or sign up with</span>
                        <button><i className="fa-brands fa-google"></i> Google</button>
                        <button><i className="fa-brands fa-github"></i> GitHub</button>
                    </div>

                    <footer>
                        <span>Have an account?</span>
                        <a href="#">Login</a>
                    </footer>
                </form>
            </div>
        </>
    )
}

export default Register