const orderRouter=require('express').Router();
const db=require('./index.js')
orderRouter.get('/', async(req, res, next)=>{
    try{
        const result= await db.getOrderByUserId(req.user.user_id)
        console.log(result)
        res.status(200).send(result)
    } catch(error){
        res.status(404).send(error)
    }
})
module.exports=orderRouter
