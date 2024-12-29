import { createAsyncThunk , createSlice} from "@reduxjs/toolkit";
import clevr from "../util/clevr";
const checkoutSlice=createSlice({
    name:'checkout',
    initialState:{
        name:'',
        phoneNumber:'',
        province:'',
        city:'',
        ward:'',
        address:'',
        payment_method:''
    },
    reducers:{
        updateName:(state, action)=>{
            state.name=action.payload
        },
        updatePhoneNumber:(state, action)=>{
            state.phoneNumber=action.payload
        },
        updateProvince:(state, action)=>{
            state.province=action.payload
        },
        updateCity:(state, action)=>{
            state.city=action.payload
        },
        updateWard:(state, action)=>{
            state.ward=action.payload
        },
        updateAddress:(state, action)=>{
            state.address=action.payload
        },
        updatePaymentMethod:(state, action)=>{
            state.payment_method=action.payload
        }
        
    },
})
export const {updateName, updatePhoneNumber, updateProvince, updateCity, updateWard, updateAddress, updatePaymentMethod}=checkoutSlice.actions
export default checkoutSlice.reducer