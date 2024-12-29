import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice.js'
import checkoutReducer from './checkoutSlice.js'
export const store=configureStore({
    reducer:{
        cart: cartReducer,
        checkout:checkoutReducer,
    }
})