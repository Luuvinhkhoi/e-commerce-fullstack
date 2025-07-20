import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import './best-seller.css'
import clevr from "../../../util/clevr"
import { Swiper, SwiperSlide } from 'swiper/react';
import Aos from "aos"
import 'aos/dist/aos.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import arrow from '../../../Assets/right-arrow.png'
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';
export const BestSeller = () =>{
    const [item, setItem]=useState()    
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        Aos.init({duration:2000})
      }, [])
    useEffect(()=>{
        async function getBestSeller(){
            const result=await clevr.getBestSeller()
            setItem(result)
            setLoading(false)
        }
        getBestSeller()
    }, [])
    return (
        <div className='best-seller' data-aos='fade-up'>
          {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
          ) : (
            <>
              <div className='best-seller-context'>
                <h2>Best Sellers</h2>
              </div>
              <div className='best-seller-slide-container'>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        navigation={true}
                        modules={[Navigation]}
                        breakpoints={{
                            0:{
                                slidesPerView:1
                            },
                            768:{
                                slidesPerView:2,
                                spaceBetween:0
                            },
                            1024:{
                                slidesPerView:3
                            }
                        }}
                        className="mySwiper" 
                    >
                        {item.map(item=>
                        <SwiperSlide key={item.product_id}>
                            <Link to={`/book/${item.product_id}`} state={item.cloudinary_url}className='best-seller-item'>
                                <div className='best-seller-item-image'>
                                    <img src={item.cloudinary_url}></img>
                                </div> 
                                <div className='best-seller-item-desc'>
                                    <div className='best-seller-item-category'>
                                        <p>{item.category_name}</p>
                                    </div> 
                                    <div className='best-seller-item-name-author'>
                                            <div className='item-name'>
                                                <p>{item.product_name.length>20 ? item.product_name.substring(0,20)+('...'):item.product_name}</p>
                                            </div>
                                            <div className='item-author'>
                                                <p>{item.author}</p>
                                            </div>
                                    </div>
                                    <div className='best-seller-item-price'>
                                            <div className='item-price'>
                                                <p>{item.price}đ</p>
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