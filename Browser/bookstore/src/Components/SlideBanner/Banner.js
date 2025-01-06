import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import './Banner.css'
export const Banner = () =>{
    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex); // Cập nhật tab được chọn
    }; 
    return (
        <div className="banner">
            <div className='banner-description'>
                <div className='banner-description-child'>
                    <div className='theme'>
                    <div className={`theme-option-${activeTab === 1 ? 'active' : ''}`} onClick={()=>handleTabClick(1)}><p>Hot promo</p></div>
                    <div className={`theme-option-${activeTab === 2 ? 'active' : ''}`} onClick={()=>handleTabClick(2)}><p>Discount 60% Special World Book Day</p></div>
                    </div>
                </div>
                <h1 className='banner-description-child'>Find over 20 million book in Clevr</h1>
                <p className='banner-description-child'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </p>
                <Link to='/search?genre=All%20genres' className='banner-description-child'>Go to Collections</Link>
            </div>
        </div>
    )
}