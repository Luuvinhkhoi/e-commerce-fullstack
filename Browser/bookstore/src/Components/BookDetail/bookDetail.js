import './bookDetail.css'
import clevr from '../../util/clevr'
import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import cartImg from '../../Assets/shopping-cart-white.png'
import star from '../../Assets/star.png'
import downArrow from '../../Assets/arrow-down.png'
export const BookDetail = ({image}) =>{
    const [bookDetail, setBookDetail]=useState()
    const [relatedBook, setRelatedBook]=useState()
    const [productImages, setProductImages]=useState([])
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
    useEffect(()=>{
        async function fetchDetail(){
          let result = await getBookDetail(id)
          let result2=await getRelatedBook(id)
          let result3=await clevr.getProductImages(id)
          setBookDetail(result)
          setRelatedBook(result2)
          setProductImages(result3)
          setLoading(false)
        }
        fetchDetail()
    }, [])
    console.log(loading)
    console.log(bookDetail)
    console.log(relatedBook)
    console.log(productImages)
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
                                        <div>5<span>/5</span></div>
                                        <div className='star-score'>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className='rating-chart'>
                                        <div>
                                            <span><img src={star}></img>5</span>
                                            <div>
                                                <div></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>4</span>
                                            <div>
                                                <div></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>3</span>
                                            <div>
                                                <div></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>2</span>
                                            <div>
                                                <div></div>
                                            </div>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span><img src={star}></img>1</span>
                                            <div>
                                                <div></div>
                                            </div>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className='book-detail-review-row-2'>
                                    <div>
                                        <img src={downArrow}></img>
                                        <button>View reviews</button>
                                    </div>
                                </div>
                                <div className='book-detail-review-row-3'>
                                     
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