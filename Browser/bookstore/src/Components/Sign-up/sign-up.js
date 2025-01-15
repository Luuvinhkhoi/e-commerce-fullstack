import { useState } from 'react'
import clevr from '../../util/clevr'
import './sign-up.css'
import {Link, useNavigate} from 'react-router-dom'
export const Signup=()=>{
    const [userNameState, setUserNameState]=useState('')
    const [emailState, setEmailState]=useState('')
    const [passwordState, setPasswordState]=useState('')
    const navigate=useNavigate()
    function handleUserNameInput(e){
        setUserNameState(prev=>prev=e.target.value)   
        console.log(userNameState) 
    }
    function handleEmailInput(e){
        setEmailState(prev=>prev=e.target.value)    
    }
    function handlePasswordInput(e){
        setPasswordState(prev=>prev=e.target.value)    
    }
    async function signUpAccount(){
        const result= await clevr.sigUpAccount(userNameState, emailState, passwordState)
        console.log(result)
        if (!result){
            console.error('fail');
        } else{
            navigate('/')
        }
    }
    function handleSubmit(e) {
        e.preventDefault(); // Ngăn trang bị reload
        signUpAccount(); // Gọi hàm đăng ký
    }
    return(
        <form onSubmit={handleSubmit} className="sign-up-form">
            <div className='sign-up-box'>
                <div className="sign-up-box-row-1">
                    <span>Sign-up</span>
                </div>
                <div className='sign-up-box-row-2'>
                        <div className='sign-up-user-name-input'> 
                            <input placeholder='Type your user name here' onChange={handleUserNameInput} required minLength={2} maxLength={30}></input>
                        </div>
                        <div className='sign-up-email-input'>
                            <input type='email' placeholder='Type your email here' onChange={handleEmailInput}  required></input>
                        </div>
                        <div className='sign-up-password-input'>
                            <input type='password' placeholder='Type your password here' onChange={handlePasswordInput} minLength={8} maxLength={50} required></input>
                        </div>
                        <div className='sign-up-button'>
                            <button>Sign-up</button>
                        </div>
                </div>
                <span>Already have an account? <Link to='/login'>Log in</Link></span>
            </div>    
        </form>
    )
}