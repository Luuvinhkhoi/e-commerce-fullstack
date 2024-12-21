import { useEffect, useState, useRef } from 'react'
import './header.css'
import clevr from '../../util/clevr'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import mathImg from '../../Assets/maths .png'
import cartImg from '../../Assets/shopping-cart.png'
import searchImg from '../../Assets/search.png'
import profileUser from '../../Assets/profile-user.png'
export const Header = () => {
    const [userName, setUserName] = useState(null)
    const [isOpen, setIsOpen]= useState('closeToogle')
    const [active, setActive]=useState(false)
    const [timeoutId, setTimeoutId] = useState(null);
    const [products, setProducts] = useState();
    const [loading, setLoading] = useState(true);
    const searchRef = useRef(null)
    const location=useLocation()
    const navigate = useNavigate()
    function handleActive(event){
        const newQuery = event.target.value;
        setLoading(true)
        setActive(!active)
        search(newQuery);
    }
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
    function handleToogleBarClick(){
        setIsOpen('closeToogle')
    }
    async function search(parameter){
        const name=parameter
        const result=await clevr.getProductByName(new URLSearchParams({name}).toString())
        setProducts(result)
        setLoading(false)
    }

    function handleInputChange(event) {
        const newQuery = event.target.value;
        // Clear trước đó nếu có
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // Thiết lập timeout mới
        const id = setTimeout(() => {
            search(newQuery);
            setActive(true)
        }, 1000); // Đặt thời gian chờ 300ms (thời gian trễ)

        setTimeoutId(id);
    }
    function handleOverlayClick(){
        setActive(false);
        setProducts(false)
    }
    function handleInputClick(event) {
        event.stopPropagation(); // Ngăn sự kiện onClick bị truyền ra ngoài
    }
    useEffect(() => {
        const handleScroll = () => {
          setActive(false);
          setProducts(false)
          setLoading(true)
        };
        window.addEventListener("scroll", handleScroll);
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
              setActive(false); // Đóng thanh tìm kiếm
              setProducts(false)
            }
        };
      
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    useEffect(() => {
        setIsOpen('closeToogle');
    }, [location]);
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
                        <li><Link to='/search?genre=All%20genres' onClick={handleToogleBarClick} state='All genres'>All books</Link></li>
                        <li><Link to='/search?genre=Fiction' onClick={handleToogleBarClick} state='Fiction'>Fiction</Link></li>
                        <li><Link to='/search?genre=Romance' onClick={handleToogleBarClick} state='Romance'>Romance</Link></li>
                        <li><Link to='/search?genre=Horror' onClick={handleToogleBarClick} state='Horror'>Horror</Link></li>
                        <li><Link to='/search?genre=Classic%20literature' onClick={handleToogleBarClick} state='Classic litterature'>Classic litterature</Link></li>
                        <li><Link to='/search?genre=Mystery' onClick={handleToogleBarClick} state='ystery'>Mystery</Link></li>
                    </ul>
                </div>
            </div>
            <div className='search-bar' onClick={handleActive} ref={searchRef}  >
                <input placeholder='Find books here' onChange={handleInputChange}></input>
                <div className='search-bar-img'>
                    <img src={searchImg}></img>
                </div>
                {active?(
                    <div className='mini-search-bar'>
                      {loading?(
                        <div>
                            <span className='recommend'>Maybe you will like</span>
                        </div>
                      ):(
                        <div className='search-bar-result'>
                            <span className='recommend'>Maybe you will like</span>
                            {products.slice(0,2).map(item=>
                                <Link to={`/${item.product_id}`} state={item.cloudinary_url}className='search-item'>
                                    <div className='search-item-image'>
                                        <img src={item.cloudinary_url}></img>
                                    </div> 
                                    <div className='search-item-desc'>
                                        <div className='search-item-item-category'>
                                            <p>{item.category_name}</p>
                                        </div> 
                                        <div className='search-item-name-author'>
                                                <div className='item-name'>
                                                    <p>{item.product_name.length>40 ? item.product_name.substring(0,40)+('...'):item.product_name}</p>
                                                </div>
                                                <div className='item-author'>
                                                    <p>{item.author}</p>
                                                </div>
                                        </div>
                                        <div className='search-item-price'>
                                                <div className='item-price'>
                                                    <p>{item.price}đ</p>
                                                </div>
                                        </div>     
                                    </div>
                                </Link>
                            )}
                        </div>
                      )}
                    </div>
                ):(
                    <div></div>
                )}
                
            </div>
            <div className={active?'header-overlay-active':'header-overlay-unactive'} onClick={handleOverlayClick}>
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