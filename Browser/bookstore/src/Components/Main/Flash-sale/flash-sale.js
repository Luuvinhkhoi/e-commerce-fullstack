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
import { Link } from 'react-router-dom';
export const FlashSale=()=>{
    const [flashSaleItem, setFlashSaleItem]=useState()
    const [loading, setLoading]=useState(true)
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
                            breakpoints={{
                                0:{
                                    slidesPerView:1,
                                    spaceBetween:0
                                },
                                768:{
                                    spaceBetween:33,
                                    slidesPerView:1,
                                },
                                1280:{
                                    slidesPerView:2,
                                    spaceBetween:33,
                                }
                            }}
                            className="mySwiper"
                        >
                            {flashSaleItem.map(item=>
                                <SwiperSlide key={item.product_id} >
                                <Link to={`/${item.product_id}`} state={item.cloudinary_url} className='flash-sale-item'>
                                    <div className='flash-sale-item-image'>
                                        {item.stock_quantity!==0?(<img src={item.cloudinary_url}></img>):(
                                            <div>
                                                <img src={item.cloudinary_url}></img>
                                                <div 
                                                style={{
                                                    backgroundColor:' rgba(0, 0, 0, .53)',
                                                    position:'absolute',
                                                    zIndex:'10',
                                                    width:'100%',
                                                    height:'100%',
                                                    top:'0',
                                                    display:'flex',
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}>
                                                    <div style={{
                                                        backgroundColor:'#DC2626',
                                                        color:'White',
                                                        padding:'.5rem',
                                                        borderRadius:'1rem'
                                                    }}>SOLD OUT</div>
                                                </div>
                                            </div>
                                        )}
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
                                                <h3>{item.sale_price}đ</h3>
                                                <h5>{item.price}đ</h5>
                                            </div>
                                        </div> 
                                        {item.stock_quantity!==0?(
                                            <div>
                                                <div className='flash-sale-progress'>      
                                                    <div style={{width: `${item.initial_quantity!==item.stock_quantity ? `${((item.initial_quantity - item.stock_quantity) / item.initial_quantity) * 100}%` : '0%'}`, backgroundColor:'#FF7020', height:'10px', borderRadius:'1rem'}}></div>
                                                </div>  
                                                <div className='flash-sale-item-quantity'>
                                                    <span>{item.stock_quantity} book in stock</span>
                                                </div>
                                            </div>
                                        ):(
                                            <div style={{color:'#DC2626'}}>This item has been sold out</div>
                                        )}  
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