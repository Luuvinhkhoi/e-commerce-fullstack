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
module.exports=cartRouter