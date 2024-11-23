import './login.css'
export const Login = ()=>{
    return (
        <div className="login">
            <div className='login-box'>
                <div className="login-box-row-1">
                    <span>Login</span>
                </div>
                <div className='login-box-row-2'>
                        <div className='login-email-input'>
                            <input type='email' placeholder='Type your email here'></input>
                        </div>
                        <div className='login-email-input'>
                            <input type='password' placeholder='Type your password here'></input>
                        </div>
                        <div className='login-button'>
                            <button>Login</button>
                        </div>
                </div>
                <a href="http://localhost:4001/login/facebook" class="button">Log In With Facebook</a>
            </div>    
        </div>
    )
}