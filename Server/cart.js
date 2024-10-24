const cartRouter=require('express').Router();
const db=require('./index.js')
cartRouter.get('/',async(req, res, next)=>{
    try{
        console.log('ye')
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
cartRouter.patch('/', async(req, res, next)=>{
    try{
        const result=await db.updateCart(req.user.user_id, req.body)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cartRouter.delete('/', async(req, res, next)=>{
    try{
        console.log('hihi')
        const result=await db.deleteProductInCartByProductId(req.user.user_id, req.body.product_id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
module.exports=cartRouter