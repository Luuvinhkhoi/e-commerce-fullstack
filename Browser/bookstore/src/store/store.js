import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice.js'
import checkoutReducer from './checkoutSlice.js'
import profileReducer from './profileSlice.js'
import searchStringReducer from './searchString.js'
export const store=configureStore({
    reducer:{
        cart: cartReducer,
        checkout:checkoutReducer,
        profile: profileReducer,
        searchString: searchStringReducer
    }
})