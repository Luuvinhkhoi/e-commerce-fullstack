export const BestSeller = () =>{
    return (
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
    )
}