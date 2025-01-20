import { useEffect, useState, useRef } from 'react'
import './header.css'
import clevr from '../../util/clevr'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import mathImg from '../../Assets/maths .png'
import cartImg from '../../Assets/shopping-cart.png'
import searchImg from '../../Assets/search.png'
import profileUser from '../../Assets/profile-user.png'
import { getProfile , getEmail, getPhoneNumber} from '../../store/profileSlice'
import { IoMenu } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
export const Header = () => {
    const userName=useSelector((state)=>state.profile.userName)
    const [activeOverlay, setActiveOverlay]=useState('close')
    const [isOpen, setIsOpen]= useState('closeToogle')
    const [active, setActive]=useState(false)
    const [searchString, setSearchString]=useState('')
    const [timeoutId, setTimeoutId] = useState(null);
    const [products, setProducts] = useState();
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive]=useState('user-name')
    function openNav(){
      if(isActive=='user-name activeNavBar'){
        setIsActive('user-name closeNavBar')

      } else{
        setIsActive('user-name activeNavBar')
      }
    }
    const searchRef = useRef(null)
    const location=useLocation()
    const navigate = useNavigate()
    const dispatch=useDispatch()
    const currentPath = window.location.pathname + window.location.search;
    function handleActive(event){
        const newQuery = event.target.value;
        setLoading(true)
        setActive(!active)
        search(newQuery);
    }
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            await dispatch(getProfile());    
            await dispatch(getEmail())  
            await dispatch(getPhoneNumber())      
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
    function handleCloseOverlay(){
        setActiveOverlay('close')
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
    async function handleSearchSubmit(e) {
        e.preventDefault()
        navigate(`/search?query=${encodeURIComponent(searchString)}`);
        setActive(false)
        setActiveOverlay('close')
    }
    function handleInputChange(event) {
        const newQuery = event.target.value;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setSearchString(newQuery)
        const id = setTimeout(() => {
            search(newQuery);
            setActive(true)
        }, 500);
        setTimeoutId(id);
    }
    function handleOverlayClick(){
        setActive(false);
        setProducts(false)
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
    
    function toggleScroll(enable) {
        if (enable) {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', disableScrollKeys);
        } else {
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', disableScrollKeys);
        }
    }
    
    function preventScroll(e) {
        e.preventDefault();
    }
    
    function disableScrollKeys(e) {
        const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'];
        if (keys.includes(e.code)) {
            e.preventDefault();
        }
    }
    const handleAddToCart = async ()=> {
            if (!userName) {
                setActiveOverlay('open'); // Hiển thị pop-up nếu chưa đăng nhập
                return;
            } else{
                navigate('/cart')
            }
            // Logic thêm sản phẩm vào giỏ hàng nếu đã đăng nhập
    };
    
    // Sử dụng useEffect để theo dõi thay đổi của activeOverlay
    useEffect(() => {
        toggleScroll(activeOverlay === 'close'); // Ngăn cuộn nếu overlay bật, cho phép cuộn nếu overlay tắt
        return () => toggleScroll(true); // Dọn dẹp sự kiện khi component unmount
    }, [activeOverlay]);
    useEffect(() => {
        if (activeOverlay==='open') {
            document.body.classList.add('no-scroll'); // Thêm lớp CSS
        } else {
            document.body.classList.remove('no-scroll'); // Xóa lớp CSS
        }

        // Dọn dẹp khi component unmount
        return () => document.body.classList.remove('no-scroll');
    }, [activeOverlay]);
    return (
      <>
        <div className={`${activeOverlay}-overlay`}>
                {userName?(
                    <></>
                ):(
                <>
                    <div className="login-pop-up">
                        <p>Please login to continue shopping</p>
                        <div>
                            <Link id="loginButton"to='/login'>Login</Link>
                            <div><button id="closeButton" onClick={handleCloseOverlay}>Close</button></div>
                        </div>
                    </div>
                    <div className='bookdetail-overlay'>

                    </div>
                </>  

                )}  
        </div>
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
            <form className='search-bar' onClick={handleActive} ref={searchRef} onSubmit={handleSearchSubmit} >
                <input placeholder='Find books here' onChange={handleInputChange}></input>
                {active?(
                    <div className='mini-search-bar'>
                      {loading?(
                        <div>
                            <span className='recommend'>Maybe you will like</span>
                        </div>
                      ):(
                        <div className='search-bar-result'>
                            <span className='recommend'>Maybe you will like</span>
                            <div>
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
                                                        <p>{item.product_name.length>25 ? item.product_name.substring(0,25)+('...'):item.product_name}</p>
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
                        </div>
                      )}
                    </div>
                ):(
                    <div></div>
                )}
                
            </form>
            <div className={active?'header-overlay-active':'header-overlay-unactive'} onClick={handleOverlayClick}>
            </div>
            <div className='cart-img' onClick={handleAddToCart}>
                <img src={cartImg}></img>
            </div>
            {userName ? 
                <div className={isActive}>
                    <div className="close" onClick={openNav}>
                        <IoMdCloseCircle className="icon"/>
                    </div>
                    <Link className='user-name-col-1' to='/profile'>
                        <img src={profileUser}></img>
                        <span style={{fontFamily:'Roboto !important'}}>{userName.length>10?userName.substring(0,10)+('...'):userName}</span>
                    </Link>
                    <div className='user-name-col-2'>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            : <div className={isActive}>
                <div className="close" onClick={openNav}>
                    <IoMdCloseCircle className="icon"/>
                </div>
                <div className='sign-in'>
                    <Link to='/login' state={{ previousUrl: currentPath }} className='sign-in-anchor'>Sign in</Link>
                </div>
                <div className='sign-up'>
                    <Link to='/sign-up' className='sign-up-button'>Create account</Link>
                </div>
              </div>
            }
            <div className="toggle" onClick={openNav}>
                    <IoMenu className="icon" />
            </div>
        </div>
      </>  
    )
}