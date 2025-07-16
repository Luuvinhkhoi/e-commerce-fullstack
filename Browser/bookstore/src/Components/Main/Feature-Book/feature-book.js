import { useEffect, useState } from 'react'
import './feature-book.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import arrow from '../../../Assets/right-arrow.png'
import whiteCartImg from '../../../Assets/shopping-cart-white.png'
import { Link } from 'react-router-dom';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';
import { insertCartIntoDatabase } from '../../../store/cartSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clevr from '../../../util/clevr'
export const FeatureBook=()=>{
    const [featureBook, setFeatureBook]=useState()
    const [loading, setLoading]=useState(true)
    const [userName, setUserName] = useState(false)
    const [activeOverlay, setActiveOverlay]=useState('close')
    const navigate=useNavigate()
    const quantityToBuy=1
    const dispatch=useDispatch()
    function handleCloseOverlay(){
        setActiveOverlay('close')
    }
    const handleAddToCart = async (id)=> {
            if (!userName) {
                setActiveOverlay('open'); // Hiển thị pop-up nếu chưa đăng nhập
                return;
            } else{
                await dispatch(insertCartIntoDatabase({id, quantityToBuy}))
                navigate('/cart')
            }
            // Logic thêm sản phẩm vào giỏ hàng nếu đã đăng nhập
    };
    useEffect(()=>{
        async function getFeatureItem(){
           const result=await clevr.getFeatureItem()
           setFeatureBook(result)
           setLoading(false)
        }
        getFeatureItem()
    },[])
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const result = await clevr.getUserProfile();
    
            if (result && result.user_name) {
              setUserName(true); 
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        fetchUserProfile();
    }, []);
    return (
        <div className='feature-book'>
            {loading ? (
               <div>Loading</div>           
            ) : (
            <>
                <div className='feature-book-context'>
                    <h2>Feature book</h2>
                </div>
                <div className='feature-book-slide-container'>
                    <Swiper
                          slidesPerView={'auto'}
                          centeredSlides={true}
                          spaceBetween={30}
                          loop={true}
                          navigation={true}
                          modules={[Navigation]}
                          breakpoints={{
                            0:{
                                slidesPerView:1,
                                centeredSlides: false
                            },
                            979:{
                                slidesPerView:2,
                                centeredSlides: false
                            },
                            1200:{
                                slidesPerView:'auto',
                                centeredSlides:true
                            },
                            
                          }}
                          className="mySwiper"
                    >
                        {featureBook.map(item=>
                            <SwiperSlide key={item.product_id}>
                              <Link to={`/${item.product_id}`} state={item.cloudinary_url}  className='feature-book-item'  style={{cursor:'pointer'}}>
                                <div className='feature-book-item-image'>
                                    <img src={item.cloudinary_url}></img>
                                </div> 
                                <div className='feature-book-item-desc'>
                                    <div className='feature-book-item-category'>
                                        <p>{item.category_name}</p>
                                    </div>
                                    <div className='feature-book-item-name-author'>
                                        <div className='item-name'>
                                            <p>{item.product_name.length>20 ? item.product_name.substring(0,20)+('...'):item.product_name}</p>
                                        </div>
                                    </div>
                                    <div className='feature-book-item-intro'>
                                        <div className='item-intro'>
                                            <span>{item.description.length>150 ? item.description.substring(0,150)+('...'):item.description}</span>
                                        </div>
                                    </div>
                                    <div className='feature-book-item-price'>
                                        <div className='item-price'>
                                            <h3>{item.price}đ</h3>
                                        </div>
                                    </div>   
                                </div> 
                              </Link>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
              </>
            )}    
        </div>
    )
}