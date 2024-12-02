import { useState } from 'react';
import './searchResult.css'
export const SearchResult=()=>{
    let [categoryOptionState, setCategoryOptionState]=useState('all genres');
    let [formatOptionState, setFormatOptionState]=useState('all format')
    const [minPrice, setMinPrice] = useState(2500);
    const [maxPrice, setMaxPrice] = useState(7500);
    const priceGap = 1000;
    const maxRange = 10000;

    // Handle thay đổi giá trị từ input number
    const handlePriceInput = (e, type) => {
        const value = parseInt(e.target.value);

        if (type === "min") {
            if (value + priceGap <= maxPrice) {
                setMinPrice(value);
            }
        } else {
            if (value - priceGap >= minPrice) {
                setMaxPrice(value);
            }
        }
    };

    // Handle thay đổi giá trị từ thanh trượt (range)
    const handleRangeInput = (e, type) => {
        const value = parseInt(e.target.value);
        if (type === "min") {
            if (value + priceGap <= maxPrice) {
                setMinPrice(value);
            } else {
                setMinPrice(maxPrice - priceGap);
            }
        } else {
            if (value - priceGap >= minPrice) {
                setMaxPrice(value);
            } else {
                setMaxPrice(minPrice + priceGap);
            }
        }
    };

    // Tính toán style cho thanh tiến trình
    const progressStyle = {
        left: `${(minPrice / maxRange) * 100}%`,
        right: `${100 - (maxPrice / maxRange) * 100}%`,
    };

    function handleCategoryOption(e){
        setCategoryOptionState(e.target.value)
    }
    function handleFormatOption(e){
        setFormatOptionState(e.target.value)
    }
    return (
        <div className='searchResult'>
            <div className='filter'>
                <h2>Filter</h2>
                <div className='filter-row-1'>
                    <div className='category'>
                        <span>Categories</span>
                        <div className='option'>
                            <div>
                                <input type='radio' id='all genres' value='all genres' name='category' checked={categoryOptionState==='all genres'} onChange={handleCategoryOption}></input>
                                <label for='all genres' >All genres</label>
                            </div>
                            <div>
                                <input type='radio' id='fiction' value='fiction' name='category' checked={categoryOptionState==='fiction'} onChange={handleCategoryOption}></input>
                                <label for='fiction' >Fiction</label>
                            </div>
                            <div>
                                <input type='radio' id='horror' value='horror' name='category' checked={categoryOptionState==='horror'} onChange={handleCategoryOption}></input>
                                <label for='horror' >Horror</label>
                            </div>
                            <div>
                                <input type='radio' id='romance' value='romance' name='category' checked={categoryOptionState==='romance'} onChange={handleCategoryOption}></input>
                                <label for='romance' >Romance</label>
                            </div>
                            <div>
                                <input type='radio' id='classic literature' value='classic literature' name='category' checked={categoryOptionState==='classic litterature'} onChange={handleCategoryOption}></input>
                                <label for='classic literature' >Classic Literature</label>
                            </div>
                            <div>
                                <input type='radio' id='mystery' value='mystery' name='category' checked={categoryOptionState==='mystery'} onChange={handleCategoryOption}></input>
                                <label for='mystery' >Mystery</label>
                            </div>
                        </div>
                    </div>
                    <div className='book-format'>
                        <span>Book Format</span>
                        <div className='option'>
                            <div>
                                <input type='radio' id='all format' value='all format' name='format' checked={formatOptionState==='all format'} onChange={handleFormatOption}></input>
                                <label for='all format' >All format</label>
                            </div>
                            <div>
                                <input type='radio' id='hard cover' value='hard cover' name='format' checked={formatOptionState==='hard cover'} onChange={handleFormatOption}></input>
                                <label for='hard cover' >Hard Cover</label>
                            </div>
                            <div>
                                <input type='radio' id='paper back' value='paper back' name='format' checked={formatOptionState==='paper back'} onChange={handleFormatOption}></input>
                                <label for='paper back' >Paper Back</label>
                            </div>
                            <div>
                                <input type='radio' id='large print' value='large print' name='format' checked={formatOptionState==='large print'} onChange={handleFormatOption}></input>
                                <label for='large print' >Large Print</label>
                            </div>                        
                        </div>
                    </div>
                    <div className='publisher'>
                        <span>Publisher</span>
                    </div>
                    <div className='year'>
                        <span>Years</span>
                    </div>
                    <div className='price-range'>
                        <span className='price-range-row-1'>Price Range</span>
                        <div className='price-range-row-2'>
                            <div className='progress' style={progressStyle}></div>
                        </div>
                        <div className='price-range-row-3'>
                            <input type='range' className='range-min' min='0' max={maxRange} value={minPrice} onChange={(e) => handleRangeInput(e, "min")}></input>
                            <input type='range' className='range-max' min='0' max={maxRange} value={maxPrice} onChange={(e) => handleRangeInput(e, "max")}></input>
                        </div>
                        <div className='price-range-row-4'>
                            <input type='number' className='input-min' value={minPrice} onChange={(e) => handlePriceInput(e, "min")}></input>
                            <input type='number' className='input-max' value={maxPrice} onChange={(e) => handlePriceInput(e, "max")}></input>
                        </div>
                    </div>
                    <div className='search-button'>
                        <button> Refine Search</button>
                    </div>
                    <div className='reset-button'>
                        <button> Reset Filter</button>
                    </div>
                </div>
            </div>
            <div className='book-list'>
                <h2>Books</h2>
            </div>
        </div>
    )
}