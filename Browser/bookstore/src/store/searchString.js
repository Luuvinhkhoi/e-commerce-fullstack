import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const cartSlice=createSlice({
    name:'cart',
    initialState:{
        searchString:''
    },
    reducers:{
        getItem:(state,action)=>{
           state.searchString=action.payload
        },
    },
})
export default cartSlice.reducer