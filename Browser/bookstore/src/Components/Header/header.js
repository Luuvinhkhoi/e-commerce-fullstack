import './header.css'
import mathImg from '../../Assets/maths .png'
import cartImg from '../../Assets/shopping-cart.png'
import searchImg from '../../Assets/search.png'
export const Header = () => {
    return (
        <div className='header'>
            <div className='brand'>
                <div className='brand-img'>
                    <img src={mathImg}/>
                </div>
                <div className='brand-name'>
                    <h1>Clevr</h1>
                </div>
            </div>
            <div className='search-bar'>
                <input placeholder='Find books here'></input>
                <div className='search-bar-img'>
                    <img src={searchImg}></img>
                </div>
            </div>
            <div className='cart-img'>
                <img src={cartImg}></img>
            </div>
            <div className='sign-in'>
                <a className='sign-in-anchor'>Sign in</a>
            </div>
            <div className='sign-up'>
                <button className='sign-up-button'>Create account</button>
            </div>
        </div>
    )
}