import { Swiper, SwiperSlide } from 'swiper/react';
import './category.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// import required modules
import { Navigation } from 'swiper/modules';
import { Scrollbar } from 'swiper/modules';
import { useEffect, useState } from 'react';
import clevr from '../../../util/clevr';
import { useNavigate } from 'react-router-dom';
export const Category = () => {
    const [category, setCategory]=useState()    
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate()
    const handleCategoryClick = (categoryName) => {
        // Chuyển hướng đến URL với params dựa trên category_name
        navigate(`/search?genre=${encodeURIComponent(categoryName)}`);
    };
    useEffect(()=>{
       async function getCategory(){
          const result= await clevr.getAllCategory()
          setCategory(result)
          setLoading(false)
       }
       getCategory()
    },[])
    return (
        <div className='category'>
            {loading ? (
                <p>Loading...</p> // Hiển thị thông báo loading trong khi dữ liệu đang được tải
          ) : (
            <>
                <h2>Categories</h2>
                <div className='category-slide-container'>
                    <Swiper
                          scrollbar={{
                            hide: true,
                          }}
                          slidesPerView={3}
                          spaceBetween={30}
                          modules={[Scrollbar]}
                          breakpoints={{
                            0:{
                                slidesPerView:1
                            },
                            650:{
                                slidesPerView:2
                            },
                            1024:{
                                slidesPerView:3
                            }
                          }}
                          className="mySwiper"
                    >
                        {category.map(item=>
                            <SwiperSlide key={item.category_name}>
                                <div className='category-item' onClick={()=>handleCategoryClick(item.category_name)}>
                                   <p>{item.category_name}</p>
                                   <span>{item.count} item</span>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </>    
           )}    
        </div>
    )
}