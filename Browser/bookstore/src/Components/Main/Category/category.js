export const Feature = () => {
    return (
        <div className='category'>
                <h2>Categories</h2>
                <div className='category-slide-container'>
                    <Swiper
                          scrollbar={{
                            hide: true,
                          }}
                          slidesPerView={3}
                          spaceBetween={30}
                          modules={[Scrollbar]}
                          className="mySwiper"
                    >
                        {arr.map(item=>
                            <SwiperSlide>
                                <div className='category-item'>
                                   <p>{item.category}</p>
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
        </div>
    )
}