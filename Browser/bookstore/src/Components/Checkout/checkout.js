import { useSelector, useDispatch } from "react-redux";
import { getCart} from '../../store/cartSlice'
import { updateName, updatePhoneNumber, updateAddress, updatePaymentMethod } from "../../store/checkoutSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LocationSelector } from "./location";
import './checkout.css'
import clevr from "../../util/clevr";
export const Checkout = ()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const userName=useSelector((state)=>state.profile.userName)
    const [activeOverlay, setActiveOverlay]=useState('close')
    const items=useSelector((state)=>state.cart.items)
    const { name, phoneNumber, province, city, ward, address, payment_method } = useSelector((state) => state.checkout)
    let totalPrice=0
    if(items){
        totalPrice = items.reduce((total, item) => {
            return total + item.price * item.cart_quantity;
        }, 0);
    }
    function handleCloseOverlay(){
        setActiveOverlay('close')
    }
    const tax = totalPrice * 0.02
    const [error, setError] = useState("");
    const handleLocationChange = (data) => {
        console.log("Dữ liệu từ LocationSelector:", data);
    };
    const handleSubmit=(e)=>{
         try{
           e.preventDefault()
           if (!name) {
            alert("Vui lòng chọn đầy đủ thông tin vị trí.");
           }
           if (!error && !phoneNumber) {
            alert("Vui lòng nhập số điện thoại đúng định dạng.");
           } 
            clevr.checkout(name,province.label, city.label, ward.label ,address, payment_method, tax, phoneNumber)
         } catch(error){
            console.log(error)
         }
    }
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        dispatch(updatePhoneNumber(value))
        // Kiểm tra định dạng số điện thoại bằng regex
        const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!vietnamPhoneRegex.test(value)) {
          setError("Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng!");
        } else {
          setError(""); // Xóa lỗi nếu số điện thoại hợp lệ
        }
    };
    const handleNameChange=(e)=>{
        const value=e.target.value
        dispatch(updateName(value))
    }
    const handleAddressChange=(e)=>{
        const value=e.target.value
        dispatch(updateAddress(value))
    }
    const handlePaymentMethodChange=(e)=>{
        const value=e.target.value
        dispatch(updatePaymentMethod(value))
    }
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
            async function getCartItems() {
                await dispatch(getCart());
            }
            getCartItems();
    }, [dispatch]);
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
    return(
      <>
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
        <div className="checkout">
            <h1>Checkout</h1>
            <div className="checkout-row-1">
              <form onSubmit={handleSubmit}>
                <div className="checkout-row-1-col-1">
                        <div className="checkout-row-1-col-1-row-1">
                            <h2>Shipping Information</h2>
                            <div><input placeholder="Họ và tên" onChange={handleNameChange} required></input></div>
                            <div><input placeholder="Số điện thoại" required onChange={handlePhoneChange}></input></div>
                            {error && <div style={{ color: "red", fontFamily:'Roboto' }}>{error}</div>}
                            <LocationSelector onChange={handleLocationChange}></LocationSelector>
                            <div><input placeholder="Địa chỉ nhà" onChange={handleAddressChange} required></input></div>
                        </div>
                        <div className="checkout-row-1-col-1-row-2">
                            <h2>Payment method</h2>
                            <div>
                                <input type="radio" name="paymentMethod" value="cod" onChange={handlePaymentMethodChange}required ></input>
                                <label>Thanh toán khi nhận hàng</label>
                            </div>
                            <div>
                                <input type="radio" name="paymentMethod" value="cod" onChange={handlePaymentMethodChange}required ></input>
                                <label>Thanh toán bằng chuyển khoản</label>
                            </div>
                        </div>
                </div>
                
                <div className="checkout-row-1-col-2">
                    <h2>Order Summary</h2>
                    <div className='checkout-row-1-col-2'>
                        <div className='checkout-row-1-col-2-row-1'>
                            <div>
                                <span>Subtotal</span>
                                <br></br>
                                <br></br>
                                <span>Tax</span>
                                <br></br>
                                <br></br>
                                <span style={{fontWeight:600}}>Total</span>
                            </div>
                            <div>
                                <span>{totalPrice}đ</span>
                                <br></br>
                                <br></br>
                                <span>{tax}đ</span>
                                <br></br>
                                <br></br>
                                <span style={{fontWeight:600}}>{totalPrice+tax}đ</span>
                            </div>
                        </div> 
                        <div className='checkout-row-1-col-2-row-2'>
                            <button type="submit" >Place an order</button>
                        </div>       
                    </div>
                </div>
              </form>
            </div>
        </div>
      </>
    )
}