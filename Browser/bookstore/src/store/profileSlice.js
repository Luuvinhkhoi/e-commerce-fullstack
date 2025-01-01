import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const profileSlice=createSlice({
    name:'cart',
    initialState:{
        userName:''
    },
    reducers:{
        updateUserName:(state,action)=>{
           state.userName=action.payload
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
export const {updateUserName}=profileSlice.actions
export default profileSlice.reducer
