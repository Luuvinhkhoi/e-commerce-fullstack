import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
export const Banner = () => {
    const [activeTab, setActiveTab] = useState(1);
    
    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    useEffect(()=>{
        Aos.init({duration:2000})
      }, [])
    return (
        <div className="banner">
            <div className='banner-description'>
                <div className='banner-description-child'>
                    <div className='theme'>
                        <div
                            className={`theme-option-${activeTab === 1 ? 'active' : ''}`}
                            onClick={() => handleTabClick(1)}
                        >
                            <p>Hot promo</p>
                        </div>
                        <div
                            className={`theme-option-${activeTab === 2 ? 'active' : ''}`}
                            onClick={() => handleTabClick(2)}
                        >
                            <p>Discount 60% Special World Book Day</p>
                        </div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div key={activeTab} data-aos="fade-up">
                    {activeTab === 1 ? (
                        <>
                            <h1 className='banner-description-child'>
                                Find over 20 million books in Clevr
                            </h1>
                            <p className='banner-description-child'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <Link to='/search?genre=All%20genres' className='banner-description-child'>
                                Go to Collections
                            </Link>
                        </>
                    ) : (
                        <>
                            <h1 className='banner-description-child'>
                                Special Offer: Get 60% Off on Your Favorite Books!
                            </h1>
                            <p className='banner-description-child'>
                                Celebrate World Book Day with us and enjoy an exclusive 60% discount on
                                a wide selection of books. Don't miss out on this limited-time offer!
                            </p>
                            <Link to='/search?genre=All%20genres&discount=true' className='banner-description-child'>
                                Browse Discounted Books
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
