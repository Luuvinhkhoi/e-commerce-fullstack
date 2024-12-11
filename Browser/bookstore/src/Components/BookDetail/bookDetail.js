import './bookDetail.css'
import clevr from '../../util/clevr'
import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import cartImg from '../../Assets/shopping-cart-white.png'
import star from '../../Assets/star.png'
import pen from '../../Assets/pen.png'
import downArrow from '../../Assets/arrow-down.png'
import upArrow from '../../Assets/top.png'
export const BookDetail = ({image}) =>{
    const [bookDetail, setBookDetail]=useState()
    const [relatedBook, setRelatedBook]=useState()
    const [productImages, setProductImages]=useState([])
    const [isActive, setIsActive]=useState('close')
    const [activeStar, setActiveStar] = useState(0)
    const [selectedStar, setSelectedStar] = useState(0)
    const [reviewContent, setReviewContent]=useState('')
    const [listReview, setListReview]=useState([])
    const [isOpenAddReview, setIsOpenAddReview]=useState(false)
    const [ratingStat, setRatingStat]=useState()
    const location=useLocation()
    const first_selected_image=location.state
    const [selectedImage, setSeletedImage]=useState(first_selected_image)
    const [quantity, setQuantity]=useState(1)
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
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
        if (quantity>1){
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
        setIsOpenAddReview(prev=>!prev)
    }
    function handleAddReviewButton(){
        handAddReview();
        openReview()
    }
    function handleCloseAddReviewButton(){
        handAddReview();
        closeReview()
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
    function handleSubmitReview(){
        return clevr.submitReview(activeStar, reviewContent, id)
    }
    
    useEffect(()=>{
        async function fetchDetail(){
          let result = await getBookDetail(id)
          let result2=await getRelatedBook(id)
          let result3=await clevr.getProductImages(id)
          let result4=await clevr.getReview(id)
          let result5=await clevr.getRatingStat(id)
          setBookDetail(result)
          setRelatedBook(result2)
          setProductImages(result3)
          setListReview(result4)
          setLoading(false)
          setRatingStat(result5)
        }
        fetchDetail()
    }, [])
    console.log(ratingStat)
    return (
      <> 
        <div className='book-detail'>
            {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
            ) : (
                bookDetail.map((item)=>
                  <>
                    <div className='book-detail-row-1'>
                        <div className='book-detail-row-1-column-1'>
                            <div className='item-name-author'>
                                <div className='item-name'>
                                    <span>{item.product_name}</span>
                                </div>
                                <div className='item-author'>
                                    <span>{item.author}</span>
                                </div>
                            </div>
                            <div className='item-desc'>
                                <span>{item.description}</span>
                            </div>
                            <div className='item-price'>
                                <span>{item.price} đ</span>
                            </div>
                            <div className='quantity-add-box'>
                                <div className='item-quantity'>
                                    <button onClick={handleMinusQuantityClick}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={handleAddQuantityClick}>+</button>
                                </div>
                                <div className='item-buy'>
                                    <img src={cartImg}></img>
                                    <span>BUY</span>
                                </div>
                            </div>
                        </div>
                        <div className='book-detail-row-1-column-2'>
                            <div className='item-image'>
                                <img src={selectedImage}></img>
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
                                    <p>{item.product_name}</p>
                                    <p>{item.author}</p>
                                    <p>{item.language}</p>
                                    <p>{item.format}</p>
                                    <p>{item.publication_year}</p>
                                    <p>{item.publisher}</p>
                                </div>                           
                            </div>
                            <span>Review</span>
                            <div className='book-detail-review'>
                                <div className='book-detail-review-row-1'>
                                    <div className='rating-score'>
                                        <div>{ratingStat.countReview > 0 ? ratingStat.totalScore/ratingStat.countReview : 0}<span>/5</span></div>
                                        <div className='star-score'>
                                            <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.totalScore/ratingStat.countReview : 0}%`}}></div>
                                        </div>
                                    </div>
                                    <div className='rating-chart'>
                                        <div>
                                            <span><img src={star}></img>5</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count5Star/ratingStat.countReview : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>4</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count4Star/ratingStat.countReview : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>3</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count3Star/ratingStat.countReview : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>2</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count2Star/ratingStat.countReview : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>1</span>
                                            <div>
                                                <div style={{width:`${ratingStat.countReview > 0 ? ratingStat.count1Star/ratingStat.countReview : 0}%`}}></div>
                                            </div>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${isActive}-book-detail-review-row-2`}>
                                    <div className={`${isActive}-add-review-button`} onClick={handleAddReviewButton}>
                                        <img src={pen}></img>
                                        <button>Add review</button>
                                    </div>
                                    <div onClick={openReview} className={`${isActive}-button`}>
                                        <img src={downArrow}></img>
                                        <button>View reviews</button>
                                    </div>
                                </div>
                                <div className={`${isActive}-book-detail-review-row-4`}>
                                    {isOpenAddReview ?
                                        (
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
                               <div className='related-book'>
                                   <div className='related-book-image'>
                                       <img src={item.cloudinary_url}></img>
                                   </div>
                                   <div className='related-book-desc'>
                                       <span className='item-name'>{item.product_name.length>10 ? item.product_name.substring(0, 10)+('...') : item.product_name}</span>
                                       <br></br>
                                       <span className='item-price'>{item.price} đ</span>
                                   </div>
                               </div>
                            )}
                        </div>
                    </div>
                  </>    
                )
            )}   
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