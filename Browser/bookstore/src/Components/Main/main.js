import './main.css'
import clock from '../../Assets/clock.png'
import quality from '../../Assets/quality.png'
import protect from '../../Assets/protected.png'
import arrow from '../../Assets/right-arrow.png'
import whiteArrow from '../../Assets/right-arrow-white.png'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

export const Main = () =>{
    const arr = [
        {
            img:'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Biography',
            name: 'hihi',
            author: 'a',
            price: 55,
        },
        {
            img:'https://images.unsplash.com/photo-1539877254216-818ed7c76096?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Advanture',
            name: 'hihi 1',
            author: 'b',
            price: 50,
        },
        {
            img:'https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fiction',
            name: 'hihi 2',
            author: 'c',
            price: 51,
        },
        {
            img:'https://images.unsplash.com/photo-1551300317-58b878a9ff6e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fairy tails',
            name: 'hihi 3',
            author: 'd',
            price: 58,
        },
        {
            img:'https://images.unsplash.com/photo-1551300329-dc0a750a7483?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fiction',
            name: 'hihi 4',
            author: 'e',
            price: 57,
        }

    ]
    return (
        <div className='main'>
            <div className='trending-context'>
                <h2>Trending this week</h2>
            </div>
            <div className='trending'>
               {arr.map((item)=>
                    <div className='trending-item' tabIndex={0}>
                        <div className='item-img'>
                            <img src={item.img}></img>
                        </div>
                        <div className='item-category'>
                            <p>{item.category}</p>
                        </div>
                        <div className='item-name-author'>
                            <div className='item-name'>
                                <p>{item.name}</p>
                            </div>
                            <div className='item-author'>
                                <p>{item.author}</p>
                            </div>
                        </div>
                        <div className='item-price'>
                            <p>${item.price}</p>
                        </div>
                    </div>               
               )} 
            </div>
            <div className="advan">
                <div className="advan-item">
                    <div className="advan-item-content">
                        <div className='image'>
                            <img src={clock}></img>
                        </div>
                        <div className="title">
                            <h3>QUICK DELIVERY</h3>
                        </div>
                        <div className="desc">
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                    </div>
                </div>
                <div className="advan-item">
                    <div className="advan-item-content">
                        <div className='image'>
                            <img src={quality}></img>
                        </div>
                        <div className="title">
                            <h3>BEST PRICE</h3>
                        </div>
                        <div className="desc">
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                    </div>
                </div>
                <div className="advan-item">
                    <div className="advan-item-content">
                        <div className='image'>
                            <img src={protect}></img>
                        </div>
                        <div className="title">
                            <h3>Return Guarantee</h3>
                        </div>
                        <div className="desc">
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='best-seller'>
              <div className='best-seller-context'>
                <h2>Best Sellers</h2>
                <div className='best-seller-button'>
                    <span>View more</span>
                    <a><img src={arrow}></img></a>
                </div>
              </div>
              <div className='slide-container'>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={10}
                        navigation={true}
                        modules={[Navigation]}
                        className="mySwiper"
                    >
                        {arr.map(item=>
                        <SwiperSlide>
                            <div className='best-seller-item'>
                            <div className='best-seller-item-image'>
                                <img src={item.img}></img>
                            </div> 
                            <div className='best-seller-item-desc'>
                                    <div className='best-seller-item-category'>
                                        <p>{item.category}</p>
                                    </div> 
                                    <div className='best-seller-item-name-author'>
                                            <div className='item-name'>
                                                <p>{item.name}</p>
                                            </div>
                                            <div className='item-author'>
                                                <p>{item.author}</p>
                                            </div>
                                    </div>
                                    <div className='best-seller-item-price'>
                                            <div className='item-price'>
                                                <p>${item.price}</p>
                                            </div>
                                    </div>     
                                </div>
                            </div>
                        </SwiperSlide>
                        )} 
                    </Swiper>
                </div>
            </div>
        </div>
    )
}