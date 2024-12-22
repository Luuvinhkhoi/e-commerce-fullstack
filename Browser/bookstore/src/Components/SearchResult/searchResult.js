import { useEffect, useState,  } from 'react';
import { Link , useLocation, useSearchParams} from 'react-router-dom';
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
import { BestSeller } from '../Main/Best-seller/best-seller';
export const SearchResult=()=>{
    const [searchParams] = useSearchParams();
    const genre = searchParams.get('genre') || 'All genres';
    let [categoryOptionState, setCategoryOptionState]=useState(genre);
    let [formatOptionState, setFormatOptionState]=useState(null)
    const [publisher, setPublisher]=useState()
    const [publisherOption, setPublisherOption]=useState()
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const pageSize=9
    const [totalPage, setTotalPage] = useState(0);
    const [pageNumber, setPageNumber]=useState(1)
    const [products, setProducts] = useState();
    const [loading, setLoading] = useState(true);
    const priceGap = 50000;
    const maxRange = 1000000;
    function getAllProduct(){
        const params = new URLSearchParams();
        params.append('pageNumber',pageNumber)
        params.append('pageSize', pageSize)
        return clevr.getAllProduct(params.toString())
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
        if (e.target.value==='all genres'){
            setCategoryOptionState('All genres')
        } else{
            setCategoryOptionState(e.target.value)
        }
    }
    function handleFormatOption(e){
        if (e.target.value==='all format'){
            setFormatOptionState(null)
        } else{
            setFormatOptionState(e.target.value)
        }
    }
    function handlePublisherOption(e){
        setPublisherOption(e.target.value)
    }
    const handlePageNumber = async (pageNumber) => {
        setPageNumber(pageNumber);
        const result=await clevr.getAllProduct(new URLSearchParams({ pageNumber, pageSize }).toString())
        setProducts(result.products)
    };
    async function filterProduct(){
        const params = new URLSearchParams();
        params.append('pageNumber',pageNumber)
        params.append('pageSize', pageSize)
        if (categoryOptionState!=='All genres') {
            params.append('category', categoryOptionState);
        }
        if (formatOptionState) params.append('format', formatOptionState);
        if (publisherOption) params.append('publisher', publisherOption);
        if (minPrice !== null && minPrice !== undefined) params.append('minPrice', minPrice);
        if (maxPrice !== null && maxPrice !== undefined) params.append('maxPrice', maxPrice);
        let result=await clevr.filterProduct(params.toString())
        setProducts(result.filterProduct)
        setTotalPage(Math.ceil(result.count/pageSize))
    }
    
    async function resetFilter() {
        let result=await getAllProduct()
        setCategoryOptionState('All genres');
        setFormatOptionState(null);
        setPublisherOption(null);
        setMinPrice(0);
        setMaxPrice(1000000);
        setProducts(result.products)
    }
    useEffect(()=>{
        async function fetchData() {
            setCategoryOptionState(genre)
            console.log(`fetch data ${categoryOptionState}`)
            if(genre==='All genres'){
                try {
                    const [productResult, publisherResult] = await Promise.all([
                      clevr.getAllProduct(new URLSearchParams({ pageNumber, pageSize }).toString()),
                      clevr.getPublisher()
                    ]);
                    setProducts(productResult.products);
                    setPublisher(publisherResult);
                    setTotalPage(Math.ceil(productResult.count[0].count/pageSize))
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu:', error);
                } finally {
                    setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                }
            } else{
                try {
                    const category=genre
                    const [productResult, publisherResult] = await Promise.all([
                      clevr.getProductByCategory(new URLSearchParams({ pageNumber, pageSize, category }).toString()),
                      clevr.getPublisher()
                    ]);
                    setProducts(productResult.filterProduct);
                    setPublisher(publisherResult);
                    setTotalPage(Math.ceil(Number(productResult.count.find(item=>item.category_name===categoryOptionState).count)/pageSize))
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu:', error);
                } finally {
                    setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                }
            }
            
          }
         fetchData() 
    },[genre])
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi pageNumber thay đổi
    }, [pageNumber]);
    useEffect(()=>{
       setCategoryOptionState(genre)
    },[genre])
    console.log(window.location.pathname)
    console.log(products)
    console.log(publisher)
    console.log(totalPage)
    console.log(genre)
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
                                <input type='radio' id='all genres' value='all genres' name='category' checked={categoryOptionState==='All genres'} onChange={handleCategoryOption}></input>
                                <label for='all genres' >All genres</label>
                            </div>
                            <div>
                                <input type='radio' id='Fiction' value='Fiction' name='category' checked={categoryOptionState==='Fiction'} onChange={handleCategoryOption}></input>
                                <label for='Fiction' >Fiction</label>
                            </div>
                            <div>
                                <input type='radio' id='Horror' value='Horror' name='category' checked={categoryOptionState==='Horror'} onChange={handleCategoryOption}></input>
                                <label for='Horror' >Horror</label>
                            </div>
                            <div>
                                <input type='radio' id='Romance' value='Romance' name='category' checked={categoryOptionState==='Romance'} onChange={handleCategoryOption}></input>
                                <label for='Romance' >Romance</label>
                            </div>
                            <div>
                                <input type='radio' id='Classic literature' value='Classic literature' name='category' checked={categoryOptionState==='Classic literature'} onChange={handleCategoryOption}></input>
                                <label for='Classic literature' >Classic literature</label>
                            </div>
                            <div>
                                <input type='radio' id='Mystery' value='Mystery' name='category' checked={categoryOptionState==='Mystery'} onChange={handleCategoryOption}></input>
                                <label for='Mystery' >Mystery</label>
                            </div>
                        </div>
                    </div>
                    <div className='book-format'>
                        <span>Book Format</span>
                        <div className='option'>
                            <div>
                                <input type='radio' id='all format' value='all format' name='format' checked={formatOptionState===null} onChange={handleFormatOption}></input>
                                <label for='all format' >All format</label>
                            </div>
                            <div>
                                <input type='radio' id='Hard cover' value='Hard cover' name='format' checked={formatOptionState==='Hard cover'} onChange={handleFormatOption}></input>
                                <label for='Hard cover' >Hard cover</label>
                            </div>
                            <div>
                                <input type='radio' id='Paper back' value='Paper back' name='format' checked={formatOptionState==='Paper back'} onChange={handleFormatOption}></input>
                                <label for='Paper back' >Paper back</label>
                            </div>
                            <div>
                                <input type='radio' id='Large print' value='Large print' name='format' checked={formatOptionState==='Large print'} onChange={handleFormatOption}></input>
                                <label for='Large print' >Large Print</label>
                            </div>                        
                        </div>
                    </div>
                    <div className='publisher'>
                        <span>Publisher</span>
                        {loading ? (
                        <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
                        ) : (
                            <div className='option'>
                            {publisher.map(item=>
                                <div>
                                <input type='radio' id={item.publisher} value={item.publisher} name='publisher' checked={publisherOption===item.publisher} onChange={handlePublisherOption}></input>
                                <label for={item.publisher} >{item.publisher}</label>
                            </div>     
                            )}
                            </div>
                        )}    
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
                    <div className='search-button' onClick={filterProduct}>
                        <button> Refine Search</button>
                    </div>
                    <div className='reset-button'  onClick={resetFilter}>
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
                            <Link to={`/${item.product_id}`} state={item.cloudinary_url}><div className='book-list-item'>
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
                            </div></Link>
                        )}
                    </div>
                )} 
                <div className='pagination'>
                    {[...Array(totalPage)].map((_, index) => (
                        <div key={index} onClick={() => handlePageNumber(index + 1)} className={pageNumber === index + 1 ? 'active-page-number' : 'unactive-page-number'}>
                            <button >
                            {index + 1}
                            </button>
                        </div>
                    ))}
                </div>  
            </div>
        </div>
        <BestSeller></BestSeller>
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
        
      </>    
    )
}