import './login.css'
import { useState } from 'react';
import axios from 'axios'

function Login() {

    const [showpass, setShowPass] = useState(false)
    const [login, setlogin] = useState({
            email: '',
            password: ''
        })


    const handleSubmit = async (e) => {
          e.preventDefault();
    
          try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, login)
            console.log('Server Response : ', response.data)
            alert('leave appliend succesfull')
          } catch (error) {
                    console.log('error submitting the form', error)
                    alert(error.response?.data?.message ?? 'Unable to register user')
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

                        <button type="button">
                            <i className="fa-brands fa-google"></i>
                            Google
                        </button>

                        <button type="button">
                            <i className="fa-brands fa-github"></i>
                            GitHub
                        </button>

                    </div>


                    <footer>
                        <span>Don't have an account?</span>
                        <a href="">Create an account</a>
                    </footer>

                </form>

            </div>

        </div>
    )
}

export default Login