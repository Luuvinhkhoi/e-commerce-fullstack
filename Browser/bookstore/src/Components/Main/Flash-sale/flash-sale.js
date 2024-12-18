import { useEffect, useState } from 'react'
import './flash-sale.css'
import clevr from '../../../util/clevr'
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
import FlashSaleCountdown from './countdown';
export const FlashSale=()=>{
    const [flashSaleItem, setFlashSaleItem]=useState()
    const [loading, setLoading]=useState(true)
    console.log(flashSaleItem)
    useEffect(()=>{
        async function getFlashSaleItem(params) {
            const result=await clevr.getFlashSaleItems()
            setFlashSaleItem(result)
            setLoading(false) 
        }
        getFlashSaleItem()
    }, [])
    return(
        <div className='flash-sale'>
            {loading?(
                <div>Loading</div>
            ):(
            <>
                <div className='flash-sale-context'>
                    <div className='flash-sale-desc'>
                        <p>Flash Sale</p>
                        <span className='intro'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        <div className='flash-sale-counting'>
                            <FlashSaleCountdown></FlashSaleCountdown>
                        </div>
                    </div>
                </div>    
                <div className='flash-sale-slide-container'>
                        <Swiper
                            slidesPerView={'auto'}
                            spaceBetween={33}
                            loop={true}
                            navigation={true}
                            modules={[Navigation]}
                            className="mySwiper"
                        >
                            {flashSaleItem.map(item=>
                                <SwiperSlide>
                                <div className='flash-sale-item'>
                                    <div className='flash-sale-item-image'>
                                        <img src={item.cloudinary_url}></img>
                                    </div> 
                                    <div className='flash-sale-item-desc'>
                                        <div className='flash-sale-item-category'>
                                            <p>{item.category_name}</p>
                                        </div>
                                        <div className='flash-sale-item-name-author'>
                                            <div className='item-name'>
                                                <p>{item.product_name.length>20?item.product_name.substring(0,20)+('...'):item.product_name}</p>
                                            </div>
                                            <div className='item-author'>
                                                <p>{item.author}</p>
                                            </div>
                                        </div>
                                        <div className='flash-sale-item-price'>
                                            <div className='item-price'>
                                                <h3>{item.sale_price}</h3>
                                                <h5>{item.price}</h5>
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