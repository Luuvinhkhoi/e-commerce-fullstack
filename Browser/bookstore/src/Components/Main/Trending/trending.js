import { useEffect, useState } from "react"
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
    return (
        <div className='trending'>
             {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
             ) : (
              <>
               {trendingItem.map((item)=>
                    <div className='trending-item' tabIndex={0}>
                        <div className='item-img'>
                            <img src={item.cloudinary_url}></img>
                        </div>
                        <div className='item-category'>
                            <p>{item.category}</p>
                        </div>
                        <div className='item-name-author'>
                            <div className='item-name'>
                                <p>{item.product_name.length>20 ? item.product_name.substring(0,20)+('...'):item.product_name}</p>
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
              </>   
             )}
        </div>
    )
}