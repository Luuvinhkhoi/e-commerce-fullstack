export const Trending=()=>{
    return (
        <div className='trending'>
               {arr.map((item)=>
                    <div className='trending-item' tabIndex={0}>
                        <div className='item-img'>
                            <img src={item.img}></img>
                        </div>
                        <div className='item-category'>
                            <p>{item.category}</p>
                        </div>
                        <div className='item-name-author'>
                            <div className='item-name'>
                                <p>{item.name}</p>
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
        </div>
    )
}