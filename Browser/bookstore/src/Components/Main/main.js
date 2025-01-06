import './main.css'
import { Banner } from '../SlideBanner/Banner'
import clock from '../../Assets/clock.png'
import quality from '../../Assets/quality.png'
import protect from '../../Assets/protected.png'
import arrow from '../../Assets/right-arrow.png'
import cartImg from '../../Assets/shopping-cart.png'
import mathImg from '../../Assets/maths .png'
import whiteArrow from '../../Assets/right-arrow-white.png'
import store from '../../Assets/store.png'
import customer from '../../Assets/white-group.png'
import book from '../../Assets/book.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { BestSeller } from './Best-seller/best-seller'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';
import { Category } from './Category/category'
import { Trending } from './Trending/trending'
import { FeatureBook } from './Feature-Book/feature-book'
import { FlashSale } from './Flash-sale/flash-sale'

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
                <p>Trending this week</p>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</span>
            </div>
            <Trending></Trending>
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
            <BestSeller></BestSeller>
            <Category></Category>
            <FeatureBook></FeatureBook>
            <FlashSale></FlashSale>
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
            
        </div>
    )
}