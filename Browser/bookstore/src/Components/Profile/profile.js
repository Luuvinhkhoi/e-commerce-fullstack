import './profile.css'
import profileUser from '../../Assets/large-profile-user.png'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import calendar from '../../Assets/calendar.png'
import clevr from '../../util/clevr'
import { getOrderHistory } from '../../store/profileSlice'
import { Link } from 'react-router-dom'
export const Profile= ()=>{
    const [activeTab, setActiveTab] = useState(1);
    const dispatch=useDispatch() // Mặc định tab đầu tiên được chọn
    const userName=useSelector((state)=>state.profile.userName)
    const email=useSelector((state)=>state.profile.email)
    const phoneNumber=useSelector((state)=>state.profile.phoneNumber)
    const orderHistory=useSelector((state)=>state.profile.orderHistory)
    const orderHistoryTime=useSelector((state)=>state.profile.orderHistory.time)
    const orderHistoryItem=useSelector((state)=>state.profile.orderHistory.item)
    const [userNameChange, setUserNameChange]=useState(userName)
    const [phoneNumberChange, setPhoneNumberChange]=useState(phoneNumber)
    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex); // Cập nhật tab được chọn
    }; 
    async function handleProfileChange(e){
        const updateData={phone_number:phoneNumberChange, user_name: userNameChange}
        await clevr.updateUser(updateData)
    }
    function handleUserNameChange(e){
        setUserNameChange(e.target.value)
    }
    function handlePhoneNumberChange(e){
        setPhoneNumberChange(e.target.value)
    }
    useEffect(()=>{
        dispatch(getOrderHistory())
    }, [])
    useEffect(()=>{
        setUserNameChange(userName)
    }, [userName])
    useEffect(()=>{
        setPhoneNumberChange(phoneNumber)
    }, [phoneNumber])

    return(
        <div className="profile">
            <div className='profile-image'>
                <img src={profileUser}></img>
            </div>
            <div className='profile-tab-list'>
                <div className={`tab-item-${activeTab === 1 ? 'active' : ''}`} onClick={()=>handleTabClick(1)}><p>User profile</p></div>
                <div className={`tab-item-${activeTab === 2 ? 'active' : ''}`} onClick={()=>handleTabClick(2)}><p>Order history</p></div>
            </div>
            {activeTab===1?(
                <form className='profile-form' onSubmit={handleProfileChange}>
                    <h2>Profile</h2>
                    <span>Update your profile right here</span>
                    <div><input value={userNameChange} onChange={handleUserNameChange}></input></div>
                    <div><input placeholder={email} className='profile-email' readOnly></input></div>
                    <div><input placeholder='Phone number' value={phoneNumberChange} onChange={handlePhoneNumberChange}></input></div>
                    <button type='submit'>Save change</button>
                </form>
            ):(
                <form className='order-history-form'>
                    <h2>Order history</h2>
                    <div className='order-invoice'>
                        {orderHistory.time.map((time, index) => (
                        <div key={time.order_id} className='order-item'>
                            {/* Thông tin đơn hàng */}
                            <div>
                                <div>
                                    <p>Order: ORD{time.order_id}</p>
                                </div>
                                <div className='calendar-price'>
                                    <p>{time.total_price}đ</p>
                                    <div>
                                        <img src={calendar}></img>
                                        <span>{time.formatted_date}</span>
                                    </div>
                                </div>
                            </div>
                            {orderHistory.item[index]?.map((item) => (
                            <div key={item.product_id} className='item-detail'>
                                <Link to={`/${item.product_id}`} state={item.cloudinary_url} className='item'>
                                    <div className='item-image'>
                                        <img src={item.cloudinary_url} alt={item.product_name} />
                                    </div>
                                    <div className='item-name-quantity-price'>
                                        <div>
                                            <p>{item.product_name}</p>
                                            <span>Quantity: {item.quantity}</span>
                                        </div>
                                        <div className='item-price'>
                                            <p>{item.price}đ</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            ))}
                        </div>
                        ))}
                    </div>
                </form>
            )}
        </div>
    )
}