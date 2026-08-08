import './login.css'
import { useState } from 'react';

function Login() {

    // <i class="fa-solid fa-eye"></i>
    // <i class="fa-solid fa-eye-slash"></i>

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

            <div className="loginContainer">
                <div className="loginMain">
                    <span>Sign in to your account</span>
                </div>

                {/* this form will be later submited in backend */}
                <form>
                    <div className="emailPas">
                        <span>Email</span>
                        <input type="text" />
                    </div>
                    <div className="passwordPass">

                        <div className="passAndForget">
                            <span>Password</span>
                            <a href="#reset">Forgot your password?</a>
                        </div>
                        <div className="password">
                        <input type={showpass ? 'text' : 'password'} />
                        <button type="button" className={showpass ? 'showBtn show' : 'showBtn hide'} onClick={(e) => {
                            e.preventDefault();
                            setShowPass(!showpass);
                        }}>
                            {showpass ? (<i className="fa-solid fa-eye-slash"></i>)
                            : (<i className="fa-solid fa-eye"></i>)
                            }
                        </button>
                        </div>

                    </div>

                    <div className="rememberMe">
                        <input type="checkbox"/>
                        <span>Remember me on this device</span>
                    </div>

                    <button className='signInBtn'>Sign in</button>

                    <div className="otherOption">
                        <span>or sign in with</span>
                        <button><i class="fa-brands fa-google"></i> google</button>
                        <button><i class="fa-brands fa-github"></i> github</button>
                    </div>

                    <footer>
                        <span>Don't have an account?</span>
                        <a href="">Create a account</a>
                    </footer>

                </form>
            </div>


        </>
    );
}

export default Login