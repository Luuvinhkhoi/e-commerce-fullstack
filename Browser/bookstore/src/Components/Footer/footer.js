import mathImg from '../../Assets/maths .png'
export const Footer = () =>{
    return (
        <div className='footer'>
                <div className='footer-col-1'>
                    <div className='footer-col-1-row-1'>
                        <div className='footer-col-1-row-1-image'>
                            <img src={mathImg}></img>
                        </div>
                        <span>Clevr</span>
                    </div>
                    <div className='footer-col-1-row-2'>
                        <span>Clevr is an online bookstore website who sells all genres of books from around the world. Find your book here now</span>
                    </div>
                    <div className='footer-col-1-row-3'>
                        <span>Follow Us</span>
                        <div className='social media'>
                            
                        </div>
                    </div>
                </div>
                <div className='footer-col-2'>
                    <span>Quick Links</span>
                    <ul>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Products</li>
                        <li>Login</li>
                        <li>Sign Up</li>
                    </ul>
                </div>
                <div className='footer-col-3'>
                    <span>Customer Area</span>
                    <ul>
                        <li>My Account</li>
                        <li>Orders</li>
                        <li>Tracking List</li>
                        <li>Terms</li>
                        <li>Privacy Policy</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div className='footer-col-4'>
                    <span>Don’t miss the newest books</span>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                    <div className='footer-subscribe-email'>
                        <div className='subscribe-email-input'>
                            <input type='email' placeholder='Type your email here'></input>
                        </div>
                        <div className='subscribe-email-button'>
                            <button>SUBSCRIBE</button>
                        </div>
                    </div>
                </div>
        </div>
    )
}