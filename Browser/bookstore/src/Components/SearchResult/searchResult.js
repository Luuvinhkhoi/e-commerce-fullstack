import { useEffect, useState,  } from 'react';
import { Link , useLocation, useSearchParams, useNavigate} from 'react-router-dom';
import clevr from '../../util/clevr';
import store from '../../Assets/store.png'
import customer from '../../Assets/white-group.png'
import book from '../../Assets/book.png'
import './searchResult.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { CiFilter } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
// import required modules
import { BestSeller } from '../Main/Best-seller/best-seller';
export const SearchResult=()=>{
    const [searchParams] = useSearchParams();
    const navigate=useNavigate()
    const genre = searchParams.get('genre') || 'All genres';
    const query = searchParams.get('query') || ''
    const isDiscount = searchParams.get('discount') === 'true';
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
    const [overlay, setOverlay]=useState(false)
    const priceGap = 50000;
    const maxRange = 1000000;
    
    async function fetchProductData() {
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
    async function filterProduct(){
        if(isDiscount){
            const params = new URLSearchParams();
            params.append('pageNumber',1)
            params.append('pageSize', pageSize)
            if (genre!=='All genres') {
                params.append('category', genre);
            }
            if (formatOptionState) params.append('format', formatOptionState);
            if (publisherOption) params.append('publisher', publisherOption);
            if (minPrice !== null && minPrice !== undefined) params.append('minPrice', minPrice);
            if (maxPrice !== null && maxPrice !== undefined) params.append('maxPrice', maxPrice);
            let result=await clevr.filterDiscountProduct(params.toString())
            setProducts(result.filterProduct)
            setPageNumber(1)
            setTotalPage(1)
            window.scrollTo(0, 0);
        }else{
        const params = new URLSearchParams();
        params.append('pageNumber',1)
        params.append('pageSize', pageSize)
        if (genre!=='All genres') {
            params.append('category', genre);
        }
        if (formatOptionState) params.append('format', formatOptionState);
        if (publisherOption) params.append('publisher', publisherOption);
        if (minPrice !== null && minPrice !== undefined) params.append('minPrice', minPrice);
        if (maxPrice !== null && maxPrice !== undefined) params.append('maxPrice', maxPrice);
        let result=await clevr.filterProduct(params.toString())
        setProducts(result.filterProduct)
        setPageNumber(1)
        setTotalPage(Math.ceil(result.count/pageSize))
        window.scrollTo(0, 0);
        }
    }
    const handlePageNumber = async (pageNumber) => {
        setPageNumber(pageNumber);
        setCategoryOptionState(genre)
        const params = new URLSearchParams();
        params.append('pageNumber',pageNumber)
        params.append('pageSize', pageSize)
        if (genre!=='All genres') {
            params.append('category', genre);
        }
        if (formatOptionState) params.append('format', formatOptionState);
        if (publisherOption) params.append('publisher', publisherOption);
        if (minPrice !== null && minPrice !== undefined) params.append('minPrice', minPrice);
        if (maxPrice !== null && maxPrice !== undefined) params.append('maxPrice', maxPrice);
        let result=await clevr.filterProduct(params.toString())
        setProducts(result.filterProduct)
        setTotalPage(Math.ceil(result.count/pageSize))
        window.scrollTo(0, 0);
    };
    async function resetFilter() {
        setFormatOptionState(null);
        setPublisherOption(null);
        setMinPrice(0);
        setMaxPrice(1000000);
        setPageNumber(1)
        if(isDiscount){
            const result=await clevr.getFlashSaleItems()
            const result2=await clevr.getPublisher()
            setPublisher(result2);
            setPublisherOption(null)
            setFormatOptionState(null)
            setTotalPage(1)
            setProducts(result);
        } else{
            if(genre==='All genres'){
                try {
                    setPageNumber(1)
                    const [productResult, publisherResult] = await Promise.all([
                    clevr.filterProduct(new URLSearchParams({ pageNumber: 1, pageSize, minPrice, maxPrice }).toString()),
                    clevr.getPublisher()
                    ]);
                    setProducts(productResult.filterProduct);
                    setPublisher(publisherResult);
                    setTotalPage(Math.ceil(productResult.count/pageSize))
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu:', error);
                } finally {
                    setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                }
            } else{
                try {
                    setPageNumber(1)
                    const category=genre
                    const [productResult, publisherResult] = await Promise.all([
                    clevr.filterProduct(new URLSearchParams({ pageNumber: 1, pageSize, category, minPrice, maxPrice }).toString()),
                    clevr.getPublisher()
                    ]);
                    setProducts(productResult.filterProduct);
                    setPublisher(publisherResult);
                    setTotalPage(Math.ceil(Number(productResult.count/pageSize)))
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu:', error);
                } finally {
                    setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                }
            }
        }      
    }
    useEffect(() => {
        if (overlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // reset nếu component unmount
        };
    }, [overlay]);
    useEffect(()=>{
        async function fetchData() {
            if(!query){
                if(genre==='All genres'){
                    try {
                        if(isDiscount){
                            const result=await clevr.getFlashSaleItems()
                            const result2=await clevr.getPublisher()
                            setPublisher(result2);
                            setPublisherOption(null)
                            setFormatOptionState(null)
                            setTotalPage(1)
                            setProducts(result);
                        } else{
                            setPageNumber(1)
                            const [productResult, publisherResult] = await Promise.all([
                            clevr.filterProduct(new URLSearchParams({ pageNumber: 1, pageSize, minPrice, maxPrice }).toString()),
                            clevr.getPublisher()
                            ]);
                            setProducts(productResult.filterProduct);
                            setPublisher(publisherResult);
                            setPublisherOption(null)
                            setFormatOptionState(null)
                            setTotalPage(Math.ceil(productResult.count/pageSize))
                        }
                    } catch (error) {
                        console.error('Lỗi khi tải dữ liệu:', error);
                    } finally {
                        setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                    }
                } else{
                    try {
                        const category=genre
                        setPageNumber(1)
                        const [productResult, publisherResult] = await Promise.all([
                          clevr.filterProduct(new URLSearchParams({ pageNumber:1, pageSize, category, minPrice, maxPrice }).toString()),
                          clevr.getPublisher()
                        ]);
                        setProducts(productResult.filterProduct);
                        setPublisher(publisherResult);
                        setPublisherOption(null);
                        setFormatOptionState(null)
                        setTotalPage(Math.ceil(Number(productResult.count/pageSize)))
                    } catch (error) {
                        console.error('Lỗi khi tải dữ liệu:', error);
                    } finally {
                        setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                    }
                }
            } else{
                try {
                    const name=query
                    setPageNumber(1)
                    const [productResult, publisherResult] = await Promise.all([
                      clevr.getProductByName(new URLSearchParams({name}).toString()),
                      clevr.getPublisher()
                    ]);
                    setProducts(productResult);
                    setPublisher(publisherResult);
                    setPublisherOption(null);
                    setFormatOptionState(null)
                    setTotalPage(Math.ceil(Number(productResult.count/pageSize)))
                } catch (error) {
                    console.error('Lỗi khi tải dữ liệu:', error);
                } finally {
                    setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
                }
            }
            
          }
         fetchData() 
    },[genre, query])
    
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi pageNumber thay đổi
    }, [products]);
    return (
      <>
        <div className='searchResult'>
            <div className='filter'>
                <h2>Filter</h2>
                <div className='filter-row-1'>
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
                                <div key={item.publisher}>
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
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>Books</h2>
                    <div className="toggle" style={{position:'relative'}} onClick={()=>{setOverlay(!overlay)}}>
                        <CiFilter size={24} className="icon" />
                    </div>
                </div>
                <div className={`overlay-${overlay?'active':'unActive'}`}>
                    <div className={overlay?'active':'unActive'}>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:'center'}}>
                                <h2>Filter</h2>
                                <IoIosClose size={32} onClick={()=>{setOverlay(false)}}></IoIosClose>
                            </div>
                            <div className='filter-row-1'>
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
                                            <div key={item.publisher}>
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
                                <div className='search-button' onClick={()=>{filterProduct();setTimeout(()=>setOverlay(false), 500)}}>
                                    <button> Refine Search</button>
                                </div>
                                <div className='reset-button'  onClick={resetFilter}>
                                    <button> Reset Filter</button>
                                </div>
                            </div>
                    </div>
                </div>

                {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
                ) : (
                    <div className='book-list-row-1'>
                        {products.length>0 ? (
                            products.map(item=>
                                <Link key={item.product_id} to={`/${item.product_id}`} state={item.cloudinary_url}><div className='book-list-item'>
                                    <div className='book-list-item-image'>
                                        {item.product_status==='Normal'?(
                                            <img src={item.cloudinary_url}></img>
                                        ):(
                                            <div className='best-seller-item'>
                                                <div className='best-seller-tag'>
                                                    <p>Best Seller</p>
                                                </div>
                                                <img src={item.cloudinary_url}></img>
                                            </div>
                                        )}
                                    </div>
                                    <div className='book-list-item-desc'>
                                        <div className='item-category'>
                                            <span>{item.category_name}</span>
                                        </div>
                                        <div className='item-name-author'>
                                            <div className='item-name'>
                                                <span>{item.product_name.length>20 ? item.product_name.substring(0, 20)+('...') : item.product_name}</span>
                                            </div>
                                        </div>
                                        <div className='item-price'>
                                            {item.sale_price?(
                                                <div className='sale-price'>
                                                    <p>{item.sale_price}đ</p>
                                                    <span>{item.price}đ</span>
                                                </div>
                                            ):(
                                                <span>{item.price}đ</span>
                                            )}
                                        </div>
                                    </div>
                                </div></Link>
                            )
                        ):(<div>Sorry, we don't find any item</div>)}
                    </div>
                )} 
                <div className='pagination'>
                    {totalPage?(
                         [...Array(totalPage)].map((_, index) => (
                            <div key={index} onClick={() => handlePageNumber(index + 1)} className={pageNumber === index + 1 ? 'active-page-number' : 'unactive-page-number'}>
                                <button >
                                {index + 1}
                                </button>
                            </div>
                        ))
                    ):(<div></div>)}
                </div>  
            </div>
        </div>
        <BestSeller></BestSeller>
        <div className='our-desc'>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={store}></img>
                      <p>268</p>
                   </div>
                   <span>Our stores around the world</span>
                </div>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={customer}></img>
                      <p>25,634</p>
                   </div>
                   <span>Our happy customers</span>
                </div>
                <div className='desc-item'>
                   <div className='desc-item-flex'>
                      <img src={book}></img>
                      <p>68+k</p>
                   </div>
                   <span>Book Collections</span>
                </div>
        </div>
        
        
      </>    
    )
}