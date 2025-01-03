import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const profileSlice=createSlice({
    name:'cart',
    initialState:{
        userName:'',
        email:'',
        phoneNumber:''
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
    }
})
export const getProfile=createAsyncThunk(
    'profile/getProfile',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updateUserName(result.user_name))
    }
)
export const getEmail=createAsyncThunk(
    'profile/getProfile',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updateEmail(result.email))
    }
)
export const getPhoneNumber=createAsyncThunk(
    'profile/getProfile',
    async(_,thunkAPI)=>{
        const result=await clevr.getUserProfile()
        thunkAPI.dispatch(updatePhoneNumber(result.phoneNumber))
    }
)
export const {updateUserName, updateEmail, updatePhoneNumber}=profileSlice.actions
export default profileSlice.reducer
