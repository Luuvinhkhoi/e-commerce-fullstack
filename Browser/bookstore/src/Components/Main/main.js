import './main.css'
import { Banner } from '../SlideBanner/Banner'
import clock from '../../Assets/clock.png'
import quality from '../../Assets/quality.png'
import protect from '../../Assets/protected.png'
import arrow from '../../Assets/right-arrow.png'
import cartImg from '../../Assets/shopping-cart.png'
import mathImg from '../../Assets/maths .png'
import whiteArrow from '../../Assets/right-arrow-white.png'
import whiteCartImg from '../../Assets/shopping-cart-white.png'
import store from '../../Assets/store.png'
import customer from '../../Assets/white-group.png'
import book from '../../Assets/book.png'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';


export const Main = () =>{
    const arr = [
        {
            img:'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Biography',
            name: 'Such a Fun Age',
            author: 'James Sulivan',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: 55,
        },
        {
            img:'https://images.unsplash.com/photo-1539877254216-818ed7c76096?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Advanture',
            name: 'The Adventure',
            author: 'Margareth Mc. Lee',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: 50,
        },
        {
            img:'https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fiction',
            name: 'Emily and the Backbone',
            author: 'Cloe Mamora',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: 51,
        },
        {
            img:'https://images.unsplash.com/photo-1551300317-58b878a9ff6e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fairy tails',
            name: 'Luster: a Novel',
            author: 'Raven Jaelani',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: 58,
        },
        {
            img:'https://images.unsplash.com/photo-1551300329-dc0a750a7483?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            category:'Fiction',
            name: 'Real Life',
            author: 'David Johanson',
            desc:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: 57,
        }

    ]
    return (
        <div className='main'>
            <Banner></Banner>
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
                            <p>Quick Delivery</p>
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
                            <p>Best Price</p>
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
                            <p>Return Guarantee</p>
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
              <div className='best-seller-slide-container'>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
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
            <div className='category'>
                <h2>Categories</h2>
                <div className='category-slide-container'>
                    <Swiper
                          scrollbar={{
                            hide: true,
                          }}
                          spaceBetween={30}
                          slidesPerView={3}
                          modules={[Scrollbar]}
                          className="mySwiper"
                    >
                        {arr.map(item=>
                            <SwiperSlide>
                                <div className='category-item'>
                                   <p>{item.category}</p>
                                </div>
                                <div className='category-item-count'>
                                    <p></p>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>
            <div className='feature-book'>
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
                        {arr.map(item=>
                            <SwiperSlide>
                              <div className='feature-book-item'>
                                <div className='feature-book-item-image'>
                                    <img src={item.img}></img>
                                </div> 
                                <div className='feature-book-item-desc'>
                                    <div className='feature-book-item-category'>
                                        <p>{item.category}</p>
                                    </div>
                                    <div className='feature-book-item-name-author'>
                                        <div className='item-name'>
                                            <p>{item.name}</p>
                                        </div>
                                    </div>
                                    <div className='feature-book-item-intro'>
                                        <div className='item-intro'>
                                            <span>{item.desc}</span>
                                        </div>
                                    </div>
                                    <div className='feature-book-item-price'>
                                        <div className='item-price'>
                                            <h3>${item.price}</h3>
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
            </div>
            <div className='flash-sale'>
                    <div className='flash-sale-context'>
                        <div className='flash-sale-desc'>
                            <p>Flash Sale</p>
                            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                            <div className='flash-sale-counting'>

                            </div>
                        </div>
                    </div>    
                    <div className='flash-sale-slide-container'>
                            <Swiper
                                slidesPerView={'auto'}
                                spaceBetween={30}
                                loop={true}
                                navigation={true}
                                modules={[Navigation]}
                                className="mySwiper"
                            >
                                {arr.map(item=>
                                    <SwiperSlide>
                                    <div className='flash-sale-item'>
                                        <div className='flash-sale-item-image'>
                                            <img src={item.img}></img>
                                        </div> 
                                        <div className='flash-sale-item-desc'>
                                            <div className='flash-sale-item-category'>
                                                <p>{item.category}</p>
                                            </div>
                                            <div className='flash-sale-item-name-author'>
                                                <div className='item-name'>
                                                    <p>{item.name}</p>
                                                </div>
                                                <div className='item-author'>
                                                    <p>{item.author}</p>
                                                </div>
                                            </div>
                                            <div className='flash-sale-item-price'>
                                                <div className='item-price'>
                                                    <h3>${item.price}</h3>
                                                </div>
                                            </div>   
                                        </div> 
                                    </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                    </div>
            </div>
            <div className='news'>
                <div className='news-context'>
                    <h2>Lastest News</h2>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                </div>
                <div className='news-grid'>
                    {arr.map(item=>
                        <div className='news-item'>
                            <div className='news-item-image'>
                                <img src={item.img}></img>
                            </div>
                            <div className='news-item-title'>
                                <span>{item.name}</span>
                            </div>
                            <div className='news-item-desc'>
                                <span>{item.desc}</span>
                            </div> 
                            <div className='news-item-author'>
                                <span>{item.author}</span>
                            </div>
                        </div>
                    )}                
                </div>
                <div className='news-button'>
                    <span>View more</span>
                    <img src={whiteArrow}></img>
                </div>            
            </div>
            <div className='our-desc'>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={store}></img>
                      <span>268</span>
                   </div>
                   <span>Our stores around the world</span>
                </div>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={customer}></img>
                      <span>25,634</span>
                   </div>
                   <span>Our happy customers</span>
                </div>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={book}></img>
                      <span>68+k</span>
                   </div>
                   <span>Book Collections</span>
                </div>
            </div>
            <div className='subscribe'>
                <div className='subscribe-context'>
                    <span>Subscribe our newsletter for newest books updates</span>
                </div>
                <div className='subscribe-email'>
                    <div className='subscribe-email-input'>
                       <input type='email' placeholder='Type your email here'></input>
                    </div>
                    <div className='subscribe-email-button'>
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>
        </div>
    )
}