import { useEffect, useState } from 'react'
import './header.css'
import clevr from '../../util/clevr'
import {Link, useNavigate} from 'react-router-dom'
import mathImg from '../../Assets/maths .png'
import cartImg from '../../Assets/shopping-cart.png'
import searchImg from '../../Assets/search.png'
import profileUser from '../../Assets/profile-user.png'
export const Header = () => {
    const [userName, setUserName] = useState(null)
    const [isOpen, setIsOpen]= useState('closeToogle')
    console.log(userName)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const result = await clevr.getUserProfile();
    
            if (result && result.user_name) {
              setUserName(result.user_name); 
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        fetchUserProfile();
    }, []);
    async function handleLogout(){
        try{
            const response = await clevr.logOut()
            if (response.ok) {
                console.log('Logged out successfully');
                navigate('/login');  // Redirect đến trang login sử dụng React Router
            } else {
                console.error('Logout failed');
            }
        } catch(error) {
            console.log(error);
        };
    }
    function handleToogleBar(){
        if(isOpen==='closeToogle'){
           setIsOpen('openToogle')
        } else{
            setIsOpen('closeToogle')
        }
    }
    return (
        <div className='header'>
            <Link to='/'><div className='brand'>
                <div className='brand-img'>
                    <img src={mathImg}/>
                </div>
                <div className='brand-name'>
                    <h1>Clevr</h1>
                </div>
            </div></Link>
            <div className='toogle-bar'>
                <button className='toogle-bar-button' onClick={handleToogleBar}>Menu</button>
                <div className={isOpen}>
                    <ul className='navigation-list'>
                        <li><Link to='/search'>All books</Link></li>
                        <li><Link>Fiction</Link></li>
                        <li><Link>Romance</Link></li>
                        <li><Link>Horror</Link></li>
                        <li><Link>Classic litterature</Link></li>
                        <li><Link>Mystery</Link></li>
                    </ul>
                </div>
            </div>
            <div className='search-bar'>
                <input placeholder='Find books here'></input>
                <div className='search-bar-img'>
                    <img src={searchImg}></img>
                </div>
            </div>
            <div className='cart-img'>
                <img src={cartImg}></img>
            </div>
            {userName ? 
                <div className='user-name'>
                    <div className='user-name-col-1'>
                        <img src={profileUser}></img>
                        <span>{userName}</span>
                    </div>
                    <div className='user-name-col-2'>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            : <div className='link'>
                <div className='sign-in'>
                    <Link to='/login' className='sign-in-anchor'>Sign in</Link>
                </div>
                <div className='sign-up'>
                    <Link to='/sign-up' className='sign-up-button'>Create account</Link>
                </div>
              </div>
            }

        </div>
    )
}