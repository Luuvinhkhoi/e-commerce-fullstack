import './main.css'
export const Main = () =>{
    return (
        <div className='main'>
            <div>
                <h1>Trending this week</h1>
            </div>
            <div className='trending'>
               <div className='trending-item'>
                  <div className='item-img'>
                     <img></img>
                  </div>
                  <div className='item-name'>
                     <p></p>
                  </div>
                  <div className='item-author'>
                     <p></p>
                  </div>
                  <div className='item-price'>
                     <p></p>
                  </div>
               </div>
            </div>
        </div>
    )
}