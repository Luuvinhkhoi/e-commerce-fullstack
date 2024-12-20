import { useEffect, useState } from 'react'
import './feature-book.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import arrow from '../../../Assets/right-arrow.png'
import whiteCartImg from '../../../Assets/shopping-cart-white.png'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';

import clevr from '../../../util/clevr'
export const FeatureBook=()=>{
    const [featureBook, setFeatureBook]=useState()
    const [loading, setLoading]=useState(true)
    useEffect(()=>{
        async function getFeatureItem(){
           const result=await clevr.getFeatureItem()
           setFeatureBook(result)
           setLoading(false)
        }
        getFeatureItem()
    },[])
    return (
        <div className='feature-book'>
            {loading ? (
               <div>Loading</div>           
            ) : (
            <>
                <div className='feature-book-context'>
                    <h2>Feature book</h2>
                    <div className='feature-book-button'>
                        <span>View more</span>
                        <a><img src={arrow}></img></a>
                    </div>
                </div>
                <div className='feature-book-slide-container'>
                    <Swiper
                          slidesPerView={"auto"}
                          centeredSlides={true}
                          spaceBetween={30}
                          loop={true}
                          navigation={true}
                          modules={[Navigation]}
                          className="mySwiper"
                    >
                        {featureBook.map(item=>
                            <SwiperSlide>
                              <div className='feature-book-item'>
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
                                            <span>{item.description.length>200 ? item.description.substring(0,200)+('...'):item.description}</span>
                                        </div>
                                    </div>
                                    <div className='feature-book-item-price'>
                                        <div className='item-price'>
                                            <h3>{item.price}đ</h3>
                                        </div>
                                    </div>   
                                    <div className='feature-book-item-cart'>
                                        <div className='item-cart'>
                                            <div className='cart-img'>
                                                <img src={whiteCartImg}></img>
                                            </div>
                                            <p>Add to cart</p>
                                        </div>
                                    </div> 
                                </div> 
                              </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
              </>
            )}    
        </div>
    )
}