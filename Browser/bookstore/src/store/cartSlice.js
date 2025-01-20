import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const cartSlice=createSlice({
    name:'cart',
    initialState:{
        items:[],
        hasUnsavedChanges: false,
        isLoading: false,
        hasError: false,
    },
    reducers:{
        getItem:(state,action)=>{
           state.items=action.payload
        },
        updateItem:(state, action)=>{
            const product=action.payload
            const existingItem=state.items.find(item=>item.bookDetail.product_id===product.bookDetail.product_id)
            if(existingItem){
               existingItem.cart_quantityToBuy+=1
               state.hasUnsavedChanges=true
            } else{
                state.items.push(action.payload)
                state.hasUnsavedChanges=true
            }
        },
        addQuantityToBuy:(state, action)=>{
            const product_id=action.payload
            const existingItem=state.items.find(item=>item.product_id===product_id)
            existingItem.cart_quantity+=1
            state.hasUnsavedChanges=true
        },
        minusQuantityToBuy:(state, action)=>{
            const product_id=action.payload
            const existingItem=state.items.find(item=>item.product_id===product_id)
            if(existingItem){
                existingItem.cart_quantity-=1
                state.hasUnsavedChanges=true
                if(existingItem.cart_quantity===0){
                    console.log('Remove')
                    state.items = state.items.filter(item => item.product_id !== action.payload);
                }
            }
        }
    },
})
export const getCart=createAsyncThunk(
    'cart/getCart',
    async(_,thunkAPI)=>{
        const result=await clevr.getCart()
        thunkAPI.dispatch(getItem(result))
    }
)
export const insertCartIntoDatabase=createAsyncThunk(
    'cart/insertCart',
    async({id, quantityToBuy},thunkAPI)=>{
        const result=await clevr.insertCart(id, quantityToBuy)
    }
)
export const updateCart=createAsyncThunk(
    'cart/updateCart',
    async(_, thunkAPI)=>{
        const state = thunkAPI.getState(); 
        const result=await clevr.updateCart(state.cart.items)
    }
)
export const deleteCart=createAsyncThunk(
    'cart/deleteCart',
    async({id}, thunkAPI)=>{
        const result=await clevr.deleteItemInCart(id)
    }
)
export const {updateItem, addQuantityToBuy, minusQuantityToBuy, getItem}=cartSlice.actions
export default cartSlice.reducer