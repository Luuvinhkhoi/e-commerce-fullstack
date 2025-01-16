import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import './trending.css'
import Aos from "aos"
import 'aos/dist/aos.css';
import clevr from "../../../util/clevr"
export const Trending=()=>{
    const [trendingItem, setTrendingItem]=useState()
    const [loading, setLoading] = useState(true);
    console.log(trendingItem)
    useEffect(()=>{
        async function getTredingItem() {
            const result=await clevr.getTrendingItem()
            setTrendingItem(result)
            setLoading(false)
        }
        getTredingItem()
    }, [])
    useEffect(()=>{
        Aos.init({duration:2000})
    }, [])
    return (
        <div className='trending' data-aos='fade-up'>
             {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
             ) : (
              <>
               {trendingItem.map((item)=>
                    <Link to={`/${item.product_id}`} state={item.cloudinary_url} className='trending-item' tabIndex={0}>
                        <div className='item-img'>
                            <img src={item.cloudinary_url}></img>
                        </div>
                        <div className='item-category'>
                            <p>{item.category}</p>
                        </div>
                        <div className='item-name-author'>
                            <div className='item-name'>
                                <p>{item.product_name.length>15 ? item.product_name.substring(0,15)+('...'):item.product_name}</p>
                            </div>
                            <div className='item-author'>
                                <p>{item.author}</p>
                            </div>
                        </div>
                        <div className='item-price'>
                            <p>{item.price}đ</p>
                        </div>
                    </Link>               
               )} 
              </>   
             )}
        </div>
    )
}