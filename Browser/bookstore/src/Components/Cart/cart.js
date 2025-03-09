import './cart.css'
import {useNavigate, useLocation, Link} from 'react-router-dom'
import {store} from '../../store/store.js'
import { useSelector, useDispatch } from 'react-redux'
import { getCart, updateCart, deleteCart } from '../../store/cartSlice'
import { minusQuantityToBuy, addQuantityToBuy } from '../../store/cartSlice'
import { useEffect, useState } from 'react'
import { getProfile } from '../../store/profileSlice.js'
export const Cart = () =>{
    const userName=useSelector((state)=>state.profile.userName)
    const items=useSelector((state)=>state.cart.items)
    const [activeOverlay, setActiveOverlay]=useState('close')
    const dispatch=useDispatch()
    const location=useLocation()
    const navigate=useNavigate()
    let totalPrice=0
    if(items){
        totalPrice = items.reduce((total, item) => {
            return total + item.price * item.cart_quantity;
        }, 0);
    }
    const tax = totalPrice * 0.02
    const hasUnsavedChanges = useSelector(state => state.cart.hasUnsavedChanges);
    function handleCloseOverlay(){
        setActiveOverlay('close')
    }
    const handleQuantityChange = async (product_id, change) => {
        if (change === -1) {
            // Decrease quantity
            console.log('hihi')
            await dispatch(minusQuantityToBuy(product_id));
            // If quantity drops to 0, dispatch deleteCart
            const updateitems=store.getState().cart.items
            const item = updateitems.find(item => item.product_id === product_id);
            if (!item || item.cart_quantity === 0) {
                dispatch(deleteCart({ id: product_id }));
            }
        } else {
            // Increase quantity
            dispatch(addQuantityToBuy(product_id));
        }
    };
    const handleCheckout=()=>{
        const invalidProduct = items.find(item => {
            if (item.sale_price > 0) {
              return item.cart_quantity > item.stock_quantity; 
            } 
            return item.cart_quantity > item.quantity; 
        });
        
        if (invalidProduct) {
            alert(
              `Sorry, We don't have enough "${invalidProduct.product_name}" in stock. We only have ` +
              `${invalidProduct.sale_price > 0 ? invalidProduct.stock_quantity : invalidProduct.quantity} item`
            );
        } else {
            navigate('/checkout');
        }
    }
    useEffect(() => {
        if (!userName) {
            setActiveOverlay('open');
        } else {
            setActiveOverlay('close');
        }
    }, [userName]);
    useEffect(() => {
        async function getCartItems() {
            await dispatch(getCart());
        }
        getCartItems();
    }, [dispatch]);
    useEffect(() => {
        // Lưu URL hiện tại để theo dõi trang
        const currentPath = location.pathname;

        // Function gửi cart lên server
        const saveCart = async () => {
            const invalidProduct = items.find(item => {
                if (item.sale_price > 0) {
                  return item.cart_quantity > item.stock_quantity; 
                } 
                return item.cart_quantity > item.quantity; 
            });
            
            if (!invalidProduct) {
                if (hasUnsavedChanges) {
                    await dispatch(updateCart(items));
                    console.log("Cart data saved!");
                }
            }
        };

        // Xử lý khi tải lại trang hoặc đóng tab
        const handleBeforeUnload = (event) => {
            if (hasUnsavedChanges) {
                saveCart();
            }
        };

        // Xử lý back/forward trên trình duyệt
        const handlePopState = () => {
            if (currentPath === "/cart") {
                saveCart();
            }
        };

        // Đăng ký event listeners
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        // Cleanup function
        return () => {
            saveCart(); // Lưu lại trước khi component unmount
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [location.pathname, dispatch, hasUnsavedChanges]);
    function disableScrollKeys(e) {
            const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'];
            if (keys.includes(e.code)) {
                e.preventDefault();
            }
    }
    function preventScroll(e) {
            e.preventDefault();
    }
    function toggleScroll(enable) {
            if (enable) {
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
                window.removeEventListener('keydown', disableScrollKeys);
            } else {
                window.addEventListener('wheel', preventScroll, { passive: false });
                window.addEventListener('touchmove', preventScroll, { passive: false });
                window.addEventListener('keydown', disableScrollKeys);
            }
    }
    useEffect(() => {
            if (!userName) {
                setActiveOverlay('open');
            } else {
                setActiveOverlay('close');
            }
    }, [userName]);
    useEffect(() => {
            toggleScroll(activeOverlay === 'close'); // Ngăn cuộn nếu overlay bật, cho phép cuộn nếu overlay tắt
            return () => toggleScroll(true); // Dọn dẹp sự kiện khi component unmount
    }, [activeOverlay]);
    useEffect(() => {
            if (activeOverlay==='open') {
                document.body.classList.add('no-scroll'); // Thêm lớp CSS
            } else {
                document.body.classList.remove('no-scroll'); // Xóa lớp CSS
            }
    
            // Dọn dẹp khi component unmount
            return () => document.body.classList.remove('no-scroll');
    }, [activeOverlay]);
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }, []);   
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("orderCode");
        const status = urlParams.get("status");

        if (orderId && status === "CANCELLED") {
            fetch("http://localhost:4001/cart/checkout/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials:'include',
                body: JSON.stringify({ orderId })
            })
            .then(response => response.json())
            .then(data => console.log("Cập nhật đơn hàng:", data))
            .catch(error => console.error("Lỗi cập nhật đơn hàng:", error));
        }
    }, []); 
    return(
        <div className='cart'>
            <div className={`${activeOverlay}-overlay`}>
                    {userName?(
                        <></>
                        ):(
                        <>
                            <div className="login-pop-up">
                                <p>Please login to continue shopping</p>
                                <div>
                                    <Link id="loginButton"to='/login'>Login</Link>
                                    <Link id="closeButton" onClick={handleCloseOverlay} to='/'>Home</Link>
                                </div>
                            </div>
                            <div className='bookdetail-overlay'>
            
                            </div>
                        </>  
                        )}  
            </div> 
            <div className='cart-row-1'>
                <div>Item</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Total Price</div>
            </div>
            <div className='cart-row-2'>
                {userName?(items.map(item=>
                    <div className='cart-row-2-item' key={item.product_id}>
                        <div className='item-image-name-author'>
                            <img src={item.cloudinary_url}></img>
                            <div className='item-name-author'>
                                <p>{item.product_name.length>20 ? item.product_name.substring(0, 20)+('...') : item.product_name}</p>
                                <span>{item.author}</span>
                            </div>
                        </div>
                        <div className='item-selection'>
                            <div className='item-quantity'>
                                <button onClick={() => handleQuantityChange(item.product_id, -1)}>-</button>
                                <span>{item.cart_quantity}</span>
                                <button onClick={() => handleQuantityChange(item.product_id, 1)}>+</button>
                            </div>
                            <div className='item-price'>
                                {item.sale_price?(<span>{item.sale_price}đ</span>):(<span>{item.price}đ</span>)}
                            </div>
                            <div className='item-total-price'>
                                {item.sale_price?(<span>{(item.sale_price * item.cart_quantity)}đ</span>):(<span>{(item.price * item.cart_quantity)}đ</span>)}
                            </div>
                        </div>
                    </div>
                  )):(<></>)}
            </div>
            <div className='cart-row-3'>
                <div className='cart-row-3-col-1'>
                    <p>Shoping Summary</p>
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                </div>
                <div className='cart-row-3-col-2'>
                    <div className='cart-row-3-col-2-row-1'>
                        <div>
                            <span>Subtotal</span>
                            <br></br>
                            <span>Tax</span>
                        </div>
                        <div>
                            <p>{totalPrice}đ</p>
                            <p>{tax}đ</p>
                        </div>
                    </div>
                    <div className='cart-row-3-col-2-row-2'>
                        <span>Total</span>
                        <p>{(totalPrice+tax)}đ</p>
                    </div>
                    <div className='checkout-button' onClick={handleCheckout}>Check out</div>
                    <div className='continue' onClick={()=>navigate('/')}>Continue Shoping</div>
                </div>
            </div>
            
        </div>
    )
}