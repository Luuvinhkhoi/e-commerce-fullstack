import { useEffect, useState } from 'react';
import clevr from '../../util/clevr';
import arrow from '../../Assets/right-arrow.png'
import store from '../../Assets/store.png'
import customer from '../../Assets/white-group.png'
import book from '../../Assets/book.png'
import mathImg from '../../Assets/maths .png'
import './searchResult.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';
export const SearchResult=()=>{
    let [categoryOptionState, setCategoryOptionState]=useState('all genres');
    let [formatOptionState, setFormatOptionState]=useState('all format')
    const [minPrice, setMinPrice] = useState(2500);
    const [maxPrice, setMaxPrice] = useState(7500);
    const [products, setProducts] = useState();
    const [loading, setLoading] = useState(true);
    const priceGap = 1000;
    const maxRange = 10000;
    function getAllProduct(){
        return clevr.getAllProduct()
    }
    // Handle thay đổi giá trị từ input number
    const handlePriceInput = (e, type) => {
        const value = parseInt(e.target.value);

        if (type === "min") {
            if (value + priceGap <= maxPrice) {
                setMinPrice(value);
            }
        } else {
            if (value - priceGap >= minPrice) {
                setMaxPrice(value);
            }
        }
    };

    // Handle thay đổi giá trị từ thanh trượt (range)
    const handleRangeInput = (e, type) => {
        const value = parseInt(e.target.value);
        if (type === "min") {
            if (value + priceGap <= maxPrice) {
                setMinPrice(value);
            } else {
                setMinPrice(maxPrice - priceGap);
            }
        } else {
            if (value - priceGap >= minPrice) {
                setMaxPrice(value);
            } else {
                setMaxPrice(minPrice + priceGap);
            }
        }
    };

    // Tính toán style cho thanh tiến trình
    const progressStyle = {
        left: `${(minPrice / maxRange) * 100}%`,
        right: `${100 - (maxPrice / maxRange) * 100}%`,
    };

    function handleCategoryOption(e){
        setCategoryOptionState(e.target.value)
    }
    function handleFormatOption(e){
        setFormatOptionState(e.target.value)
    }
    useEffect(()=>{
        const fetchProduct= async()=>{
           let result= await getAllProduct()
           setProducts(result); // Cập nhật kết quả
           setLoading(false);
        }
        fetchProduct()
    },[])
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
      <>
        <div className='searchResult'>
            <div className='filter'>
                <h2>Filter</h2>
                <div className='filter-row-1'>
                    <div className='category'>
                        <span>Categories</span>
                        <div className='option'>
                            <div>
                                <input type='radio' id='all genres' value='all genres' name='category' checked={categoryOptionState==='all genres'} onChange={handleCategoryOption}></input>
                                <label for='all genres' >All genres</label>
                            </div>
                            <div>
                                <input type='radio' id='fiction' value='fiction' name='category' checked={categoryOptionState==='fiction'} onChange={handleCategoryOption}></input>
                                <label for='fiction' >Fiction</label>
                            </div>
                            <div>
                                <input type='radio' id='horror' value='horror' name='category' checked={categoryOptionState==='horror'} onChange={handleCategoryOption}></input>
                                <label for='horror' >Horror</label>
                            </div>
                            <div>
                                <input type='radio' id='romance' value='romance' name='category' checked={categoryOptionState==='romance'} onChange={handleCategoryOption}></input>
                                <label for='romance' >Romance</label>
                            </div>
                            <div>
                                <input type='radio' id='classic literature' value='classic literature' name='category' checked={categoryOptionState==='classic litterature'} onChange={handleCategoryOption}></input>
                                <label for='classic literature' >Classic Literature</label>
                            </div>
                            <div>
                                <input type='radio' id='mystery' value='mystery' name='category' checked={categoryOptionState==='mystery'} onChange={handleCategoryOption}></input>
                                <label for='mystery' >Mystery</label>
                            </div>
                        </div>
                    </div>
                    <div className='book-format'>
                        <span>Book Format</span>
                        <div className='option'>
                            <div>
                                <input type='radio' id='all format' value='all format' name='format' checked={formatOptionState==='all format'} onChange={handleFormatOption}></input>
                                <label for='all format' >All format</label>
                            </div>
                            <div>
                                <input type='radio' id='hard cover' value='hard cover' name='format' checked={formatOptionState==='hard cover'} onChange={handleFormatOption}></input>
                                <label for='hard cover' >Hard Cover</label>
                            </div>
                            <div>
                                <input type='radio' id='paper back' value='paper back' name='format' checked={formatOptionState==='paper back'} onChange={handleFormatOption}></input>
                                <label for='paper back' >Paper Back</label>
                            </div>
                            <div>
                                <input type='radio' id='large print' value='large print' name='format' checked={formatOptionState==='large print'} onChange={handleFormatOption}></input>
                                <label for='large print' >Large Print</label>
                            </div>                        
                        </div>
                    </div>
                    <div className='publisher'>
                        <span>Publisher</span>
                    </div>
                    <div className='year'>
                        <span>Years</span>
                    </div>
                    <div className='price-range'>
                        <span className='price-range-row-1'>Price Range</span>
                        <div className='price-range-row-2'>
                            <div className='progress' style={progressStyle}></div>
                        </div>
                        <div className='price-range-row-3'>
                            <input type='range' className='range-min' min='0' max={maxRange} value={minPrice} onChange={(e) => handleRangeInput(e, "min")}></input>
                            <input type='range' className='range-max' min='0' max={maxRange} value={maxPrice} onChange={(e) => handleRangeInput(e, "max")}></input>
                        </div>
                        <div className='price-range-row-4'>
                            <input type='number' className='input-min' value={minPrice} onChange={(e) => handlePriceInput(e, "min")}></input>
                            <input type='number' className='input-max' value={maxPrice} onChange={(e) => handlePriceInput(e, "max")}></input>
                        </div>
                    </div>
                    <div className='search-button'>
                        <button> Refine Search</button>
                    </div>
                    <div className='reset-button'>
                        <button> Reset Filter</button>
                    </div>
                </div>
            </div>
            <div className='book-list'>
                <h2>Books</h2>
                {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
                ) : (
                    <div className='book-list-row-1'>
                        {products.map(item=>
                            <div className='book-list-item'>
                                <div className='book-list-item-image'>
                                    <img src={item.cloudinary_url}></img>
                                </div>
                                <div className='book-list-item-desc'>
                                    <div className='item-category'>
                                        <span>{item.category_name}</span>
                                    </div>
                                    <div className='item-name-author'>
                                        <div className='item-name'>
                                            <span>{item.product_name.length>20 ? item.product_name.substring(0, 20)+('...') : item.product_name}</span>
                                        </div>
                                        <div className='item-author'>
                                            <span>{item.author}</span>
                                        </div>
                                    </div>
                                    <div className='item-price'>
                                        <span>${item.price}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}   
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
        <div className='footer'>
                <div className='footer-col-1'>
                    <div className='footer-col-1-row-1'>
                        <div className='footer-col-1-row-1-image'>
                            <img src={mathImg}></img>
                        </div>
                        <span>Clevr</span>
                    </div>
                    <div className='footer-col-1-row-2'>
                        <span>Clevr is an online bookstore website who sells all genres of books from around the world. Find your book here now</span>
                    </div>
                    <div className='footer-col-1-row-3'>
                        <span>Follow Us</span>
                        <div className='social media'>
                            
                        </div>
                    </div>
                </div>
                <div className='footer-col-2'>
                    <span>Quick Links</span>
                    <ul>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Products</li>
                        <li>Login</li>
                        <li>Sign Up</li>
                    </ul>
                </div>
                <div className='footer-col-3'>
                    <span>Customer Area</span>
                    <ul>
                        <li>My Account</li>
                        <li>Orders</li>
                        <li>Tracking List</li>
                        <li>Terms</li>
                        <li>Privacy Policy</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className='footer-col-4'>
                    <span>Don’t miss the newest books</span>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                    <div className='footer-subscribe-email'>
                        <div className='subscribe-email-input'>
                            <input type='email' placeholder='Type your email here'></input>
                        </div>
                        <div className='subscribe-email-button'>
                            <button>SUBSCRIBE</button>
                        </div>
                    </div>
                </div>
        </div>
      </>    
    )
}