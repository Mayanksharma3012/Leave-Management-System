import './register.css'
import { useState } from 'react';
import axios from 'axios'

function Register() {
    const [showpass, setShowPass] = useState(false)
    const [signup, setSignup] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, signup)
        console.log('Server Response : ', response.data)
        alert('leave appliend succesfull')
      } catch (error) {
                console.log('error submitting the form', error)
                alert(error.response?.data?.message ?? 'Unable to register user')
      }
    }
    

    return (
        <div className='loginPage'>
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

                <form onSubmit={handleSubmit}>
                    <div className="emailPas">
                        <span>Email</span>
                        <input type="email" name='email' value={signup.email} 
                        onChange={(e)=> 
                            setSignup({...signup, email: e.target.value  })
                        }/>
                    </div>

                    <div className="passwordPass">
                        <span>Password</span>
                        <div className="password">
                            <input type={showpass ? 'text' : 'password'}  name='password' value={signup.password}
                                onChange={(e)=> setSignup({...signup, password: e.target.value})}
                            />
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
                        <input type="checkbox"/>
                        <span>Remember me on this device</span>
                    </div>

                    <button className='signUpBtn' type='submit'>Sign up</button>

                    <div className="otherOption">
                        <span>or sign up with</span>
                        <button><i className="fa-brands fa-google"></i> Google</button>
                        <button><i className="fa-brands fa-github"></i> GitHub</button>
                    </div>

                    <footer>
                        <span>Have an account?</span>
                        <a href="/login">Login</a>
                    </footer>
                </form>
            </div>
        </div>
    )
}

export default Register