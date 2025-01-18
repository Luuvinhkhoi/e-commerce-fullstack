import './bookDetail.css'
import clevr from '../../util/clevr'
import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { insertCartIntoDatabase } from '../../store/cartSlice'
import { updateItem } from '../../store/cartSlice'
import cartImg from '../../Assets/shopping-cart-white.png'
import star from '../../Assets/star.png'
import pen from '../../Assets/pen.png'
import downArrow from '../../Assets/arrow-down.png'
import upArrow from '../../Assets/top.png'
export const BookDetail = ({image}) =>{
    const navigate=useNavigate()
    const [userName, setUserName] = useState(false)
    const [activeOverlay, setActiveOverlay]=useState('close')
    const [bookDetail, setBookDetail]=useState()
    const [relatedBook, setRelatedBook]=useState()
    const [productImages, setProductImages]=useState([])
    const [isActive, setIsActive]=useState('close')
    const [activeStar, setActiveStar] = useState(1)
    const [selectedStar, setSelectedStar] = useState(0)
    const [reviewContent, setReviewContent]=useState('')
    const [listReview, setListReview]=useState([])
    const [isReview, setIsReview]=useState()
    const [isOpenAddReview, setIsOpenAddReview]=useState(false)
    const [ratingStat, setRatingStat]=useState()
    const location=useLocation()
    const first_selected_image=location.state
    console.log(first_selected_image)
    const [selectedImage, setSeletedImage]=useState(first_selected_image)
    const [quantityToBuy, setQuantity]=useState(1)
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const dispatch=useDispatch()
    console.log(id)
    function getBookDetail(id){
          return clevr.getBookDetail(id)
    }
    function getRelatedBook(id){
        return clevr.getRelatedBook(id)
    }
    function handleAddQuantityClick(){
        setQuantity(prev=>prev+1)
    }
    function handleMinusQuantityClick(){
        if (quantityToBuy>1){
            setQuantity(prev=>prev-1)
        }
    }
    function closeReview(){
        setIsActive('close')
    }
    function openReview(){
        setIsActive('open')
    }
    function handAddReview(){
        setIsOpenAddReview(true)
    }
    function handleViewReview(){
        setIsOpenAddReview(false)
        openReview()
    }
    function handleAddReviewButton(){
        handAddReview();
        openReview()
    }
    function handleCloseAddReviewButton(){
        handAddReview();
        closeReview()
        if(isReview.length>0){
            setActiveStar(isReview[0].score)
        }
    }
    function handleMouseOverStar(e) {
        const starValue = e.target.getAttribute('data')
        setActiveStar(starValue)
    }
      
    function handleMouseOutStar(e) {
        const starValue = e.target.getAttribute('data')
        setActiveStar(starValue)
    }
    function handleStarClick (e){
        const starValue = e.target.getAttribute('data')
        setSelectedStar(starValue)  
    }
    function handleReviewContent(e){
        setReviewContent(e.target.value)
    }
    async function handleSubmitReview(){
        await clevr.submitReview(activeStar, reviewContent, id)
        let result4=await clevr.getReview(id)
        setListReview(result4.productReview)
        let result5=await clevr.getRatingStat(id)
        setRatingStat(result5)
        handAddReview();
        closeReview()
        handleViewReview()
    }
    async function changeReview() {
        const updateData={score: activeStar, content:reviewContent}
        await clevr.updateReview(updateData, id)
        let result4=await clevr.getReview(id)
        setListReview(result4.productReview)
        let result5=await clevr.getRatingStat(id)
        setRatingStat(result5)
        handAddReview();
        closeReview()
        handleViewReview()
    }
    const showLoginPopup = () => {
        alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
    };

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async ()=> {
        if (!userName) {
            setActiveOverlay('open'); // Hiển thị pop-up nếu chưa đăng nhập
            return;
        } else{
            await dispatch(insertCartIntoDatabase({id, quantityToBuy}))
            navigate('/cart')
        }
        // Logic thêm sản phẩm vào giỏ hàng nếu đã đăng nhập
    };
    function handleCloseOverlay(){
        setActiveOverlay('close')
    }

    function toggleScroll(enable) {
        if (enable) {
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('keydown', disableScrollKeys);
        } else {
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('keydown', disableScrollKeys);
        }
    }
    
    function preventScroll(e) {
        e.preventDefault();
    }
    
    function disableScrollKeys(e) {
        const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'];
        if (keys.includes(e.code)) {
            e.preventDefault();
        }
    }
    
    // Sử dụng useEffect để theo dõi thay đổi của activeOverlay
    useEffect(() => {
        toggleScroll(activeOverlay === 'close'); // Ngăn cuộn nếu overlay bật, cho phép cuộn nếu overlay tắt
        return () => toggleScroll(true); // Dọn dẹp sự kiện khi component unmount
    }, [activeOverlay]);
    useEffect(() => {
        if (activeOverlay==='open') {
            document.body.classList.add('no-scroll'); // Thêm lớp CSS
        } else {
            document.body.classList.remove('no-scroll'); // Xóa lớp CSS
        }

        // Dọn dẹp khi component unmount
        return () => document.body.classList.remove('no-scroll');
    }, [activeOverlay]);
    useEffect(() => {
        window.scrollTo(0, 0);
        setSeletedImage(first_selected_image)
    }, [id]);
    useEffect(()=>{
        try{
            async function fetchDetail(){
                let result = await getBookDetail(id)
                let result2=await getRelatedBook(id)
                let result3=await clevr.getProductImages(id)
                let result4=await clevr.getReview(id)
                let result5=await clevr.getRatingStat(id)
                if(result4.isReviewResult.length>0){
                  setActiveStar(result4.isReviewResult[0].score)
                  setReviewContent(result4.isReviewResult[0].content)
                }
                console.log(result)
                setBookDetail(result)
                setRelatedBook(result2)
                setProductImages(result3)
                setListReview(result4.productReview)
                setIsReview(result4.isReviewResult)
                setRatingStat(result5)
              }
              fetchDetail()
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false); // Đặt loading thành false sau khi dữ liệu đã tải xong
        }
        
    }, [id])
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const result = await clevr.getUserProfile();
    
            if (result && result.user_name) {
              setUserName(true); 
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        fetchUserProfile();
    }, []);
    console.log(isReview)
    console.log(bookDetail)
    return (
      <> 
        <div className={`${activeOverlay}-overlay`}>
            {userName?(
                <></>
            ):(
              <>
                <div className="login-pop-up">
                    <p>Please login to continue shopping</p>
                    <div>
                        <Link id="loginButton"to='/login'>Login</Link>
                        <Link id="closeButton" onClick={handleCloseOverlay}>Close</Link>
                    </div>
                </div>
                <div className='bookdetail-overlay'>

                </div>
              </>  

            )}  
        </div>
        <div className='book-detail'>
            {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
            ) : (
                  <>
                    <div className='book-detail-row-1'>
                        <div className='book-detail-row-1-column-1'>
                            <div className='item-name-author'>
                                <div className='item-name'>
                                    <span>{bookDetail.product_name}</span>
                                </div>
                                <div className='item-author'>
                                    <span>{bookDetail.author}</span>
                                </div>
                            </div>
                            <div className='item-desc'>
                                <span>{bookDetail.description}</span>
                            </div>
                            <div className='item-price'>
                                {bookDetail.stock_quantity>0?(
                                    <div style={{display:'flex', gap:'1rem', alignItems:'baseline'}}>
                                        <p>{bookDetail.sale_price}đ</p>
                                        <span style={{fontSize:'24px', color:'rgb(99, 99, 99)', textDecorationLine:'line-through'}}>{bookDetail.price}đ</span>
                                    </div>
                                ):(<span>{bookDetail.price} đ</span>)}
                            </div>
                            <div className='quantity-add-box'>
                                <div className='item-quantity'>
                                    <button onClick={handleMinusQuantityClick}>-</button>
                                    <span>{quantityToBuy}</span>
                                    <button onClick={handleAddQuantityClick}>+</button>
                                </div>
                                <Link className='item-buy' onClick={handleAddToCart}>
                                    <img src={cartImg}></img>
                                    <span>BUY</span>
                                </Link>
                            </div>
                        </div>
                        <div className='book-detail-row-1-column-2'>
                            <div className='item-image'>
                                 {first_selected_image?(<img src={selectedImage}></img>):(<img src={productImages[0].cloudinary_url}></img>)}
                            </div>  
                            <div className='item-list-image'>
                                {productImages.map(image=>
                                    <div onClick={()=>setSeletedImage(image.cloudinary_url)} style={{borderRadius:8, overflow:'hidden', height:120, marginBottom:10}}>
                                        <img src={image.cloudinary_url}></img>
                                    </div>
                                )}
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className='book-detail-row-2'>
                        <div className='book-detail-row-2-col-1'>
                            <span>Detail</span>
                            <div className='book-detail-table'>
                                <div className='book-detail-table-col-1'>
                                    <ul>
                                        <li>Name</li>
                                        <li>Author</li>
                                        <li>Language</li>
                                        <li>Book Format</li>
                                        <li>Date Published</li>
                                        <li>Publisher</li>
                                    </ul>
                                </div>
                                <div className='book-detail-table-col-2'>
                                    <p>{bookDetail.product_name}</p>
                                    <p>{bookDetail.author}</p>
                                    <p>{bookDetail.language}</p>
                                    <p>{bookDetail.format}</p>
                                    <p>{bookDetail.publication_year}</p>
                                    <p>{bookDetail.publisher}</p>
                                </div>                           
                            </div>
                            <span>Review</span>
                            <div className='book-detail-review'>
                                <div className='book-detail-review-row-1'>
                                    <div className='rating-score'>
                                        <div>{ratingStat.countReview > 0 ? ratingStat.totalScore/ratingStat.countReview : 0}<span>/5</span></div>
                                        <div className='star-score'>
                                            <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.totalScore/ratingStat.countReview *20 : 0}%`}}></div>
                                        </div>
                                    </div>
                                    <div className='rating-chart'>
                                        <div>
                                            <span><img src={star}></img>5</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count5Star/ratingStat.countReview*100 : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>4</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count4Star/ratingStat.countReview*100 : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>3</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count3Star/ratingStat.countReview*100 : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>2</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count2Star/ratingStat.countReview*100 : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>1</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count1Star/ratingStat.countReview*100 : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isActive}-book-detail-review-row-2`}>
                                    <div className={`${isActive}-add-review-button`} onClick={handleAddReviewButton}>
                                        <img src={pen}></img>
                                        {isReview.length>0?(<button>Change review</button>):(<button>Add review</button>)}
                                    </div>
                                    <div onClick={handleViewReview} className={`${isActive}-button`}>
                                        <img src={downArrow}></img>
                                        <button>View reviews</button>
                                    </div>
                                </div>
                                <div className={`${isActive}-book-detail-review-row-4`}>
                                    {isOpenAddReview ?
                                        (
                                          userName ? (
                                            isReview.length>0?(
                                                <div className='add-review-box'>
                                                    <div className='rating-score'>
                                                        <div className='star-score'>
                                                            <div
                                                                className={`${activeStar >=1 || (!activeStar && selectedStar >=1) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="1"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=2 || (!activeStar && selectedStar >=2) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="2"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=3 || (!activeStar && selectedStar >=3) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="3"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=4 || (!activeStar && selectedStar >=4) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="4"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=5 || (!activeStar && selectedStar >=5) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="5"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className='review-input'>
                                                        <input onChange={handleReviewContent} value={reviewContent}></input>
                                                    </div>
                                                    <div className='review-button'>
                                                        <button onClick={handleCloseAddReviewButton}>Cancel</button>
                                                        <button onClick={changeReview}>Change review</button>
                                                    </div>
                                                </div>
                                            ):(
                                                <div className='add-review-box'>
                                                    <div className='rating-score'>
                                                        <div className='star-score'>
                                                            <div
                                                                className={`${activeStar >=1 || (!activeStar && selectedStar >=1) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="1"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=2 || (!activeStar && selectedStar >=2) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="2"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=3 || (!activeStar && selectedStar >=3) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="3"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=4 || (!activeStar && selectedStar >=4) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="4"
                                                            ></div>
                                                            <div
                                                                className={`${activeStar >=5 || (!activeStar && selectedStar >=5) ? 'active' : 'unActive'}-star-item`}
                                                                onMouseOver={handleMouseOverStar}
                                                                onMouseOut={handleMouseOutStar}
                                                                onClick={handleStarClick}
                                                                data="5"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className='review-input'>
                                                        <input onChange={handleReviewContent}></input>
                                                    </div>
                                                    <div className='review-button'>
                                                        <button onClick={handleCloseAddReviewButton}>Cancel</button>
                                                        <button onClick={handleSubmitReview}>Submit</button>
                                                    </div>
                                                </div>
                                            )
                                            ) : (
                                            <div className='recommend-login'>
                                                <span>Please <Link to={'/login'}>login</Link> or <Link to={'/sign-up'}>sign-up</Link> to review</span>
                                                <div onClick={closeReview}>
                                                   <div>
                                                        <button>Close</button>
                                                   </div>
                                                </div>
                                            </div>
                                            )
                                        ) : 
                                        (
                                            <div className='list-review'>
                                                {listReview.map(item=>
                                                    <div>
                                                        <div className='rating-score'>
                                                            <div>{item.score}</div>
                                                            <div className='star-score'>
                                                                <div style={{width:`${(item.score)*20}%`}}></div>
                                                            </div>
                                                        </div>
                                                        <div className='review-detail'>
                                                            <p>{item.user_name}</p>
                                                            <span>{item.content}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className='button-flex'>
                                                    <div className='load-more'>
                                                        <img src={downArrow}></img>
                                                        <button>Load more</button>
                                                    </div>
                                                    <div onClick={closeReview} className='close-review'>
                                                        <img src={upArrow}></img>
                                                        <button>Close</button>
                                                    </div>
                                                </div>
                                            </div>    
                                               
                                        ) 
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='book-detail-row-2-col-2'>
                            <span>Related book</span>
                            {relatedBook.map(item=>
                               <Link to={`/${item.product_id}`} state={item.cloudinary_url} className='related-book'>
                                   <div className='related-book-image'>
                                       <img src={item.cloudinary_url}></img>
                                   </div>
                                   <div className='related-book-desc'>
                                       <span className='item-name'>{item.product_name.length>20 ? item.product_name.substring(0, 20)+('...') : item.product_name}</span>
                                       <br></br>
                                       <span className='item-price'>{item.price} đ</span>
                                   </div>
                               </Link>
                            )}
                        </div>
                    </div>
                  </>    
            )}   
        </div>
      </>  
    )
}