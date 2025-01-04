import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const profileSlice=createSlice({
    name:'cart',
    initialState:{
        userName:'',
        email:'',
        phoneNumber:'',
        orderHistory:[]
    },
    reducers:{
        updateUserName:(state,action)=>{
           state.userName=action.payload
        },
        updateEmail:(state,action)=>{
            state.email=action.payload
        },
        updatePhoneNumber:(state,action)=>{
            state.phoneNumber=action.payload
        },
        updateOrderHistory:(state, action)=>{
            state.orderHistory=action.payload
        }
    }
})
export const getOrderHistory=createAsyncThunk(
    'profile/getOrderHistory',
    async(_,thunkAPI)=>{
        const result=await clevr.getOrderHistory()
        thunkAPI.dispatch(updateOrderHistory(result))
    }
)
export const getProfile=createAsyncThunk(
    'profile/getProfile',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updateUserName(result.user_name))
    }
)
export const getEmail=createAsyncThunk(
    'profile/getEmail',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updateEmail(result.email))
    }
)
export const getPhoneNumber=createAsyncThunk(
    'profile/getPhoneNumber',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updatePhoneNumber(result.phoneNumber))
    }
)
export const {updateUserName, updateEmail, updatePhoneNumber, updateOrderHistory}=profileSlice.actions
export default profileSlice.reducer
