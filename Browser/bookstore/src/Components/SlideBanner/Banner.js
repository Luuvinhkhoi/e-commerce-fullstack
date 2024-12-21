import React, {useEffect, useState} from 'react'
import './Banner.css'
export const Banner = () =>{
    const [isFocus, setIsFocus]=useState()
    useEffect(()=>{
        document.getElementById('theme-option-1').focus()
    })
    return (
        <div className="banner">
            <div className='banner-description'>
                <div className='banner-description-child'>
                    <div className='theme'>
                        <div className='theme-option' id='theme-option-1' tabIndex={0}>
                            <span>Hot promo</span>
                        </div>
                        <div className='theme-option' tabIndex={0}>
                            <span>Discount 60% Special World Book Day</span>
                        </div>
                    </div>
                </div>
                <h1 className='banner-description-child'>Find over 20 million book in Clevr</h1>
                <p className='banner-description-child'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </p>
                <button className='banner-description-child'>Go to Collections</button>
            </div>
        </div>
    )
}