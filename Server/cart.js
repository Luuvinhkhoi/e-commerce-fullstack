const cartRouter=require('express').Router();
const express=require('express')
const checkoutRouter = express.Router({mergeParams: true});
const db=require('./index.js')
cartRouter.get('/',async(req, res, next)=>{
    try{
        const result=await db.getCartByUserId(req.user.user_id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cartRouter.post('/', async(req,res,next)=>{
    try{
        const {product_id, quantity}=req.body
        const result=await db.insertProductIntoCart(req.user.user_id, product_id, quantity)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})

cartRouter.use('/checkout', checkoutRouter)
checkoutRouter.post('/',async(req, res, next)=>{
    try{
        const {name,phone_number,province, city, ward , address, payment_method, fee}=req.body
        const result=await db.checkout(req.user.user_id,province, city, ward, address,phone_number, payment_method, name, fee)
        if (result){
            res.status(200).send('Checkout success')
        }
    } catch(error){
        res.status(500).send({message: error.message})
    }
})
cartRouter.put('/', async(req, res, next)=>{
    try{
        const result=await db.updateCart(req.user.user_id, req.body.updateData)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cartRouter.delete('/', async(req, res, next)=>{
    try{
        console.log('hihi')
        const result=await db.deleteProductInCartByProductId(req.user.user_id, req.body.id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
module.exports=cartRouter