const express=require('express')
const reviewRouter=express.Router()
const db=require('./index.js')
reviewRouter.get('/', async(req,res, next)=>{
    const result=await db.getReview()
    if(result){
        res.status(200).send(result)
    } else{
        res.status(404).send
    }
})
reviewRouter.post('/:product_id', async(req, res, next)=>{
    const {score,content}= req.body;
    const result= await db.addReview(score, content, req.params.product_id, req.user.user_id)
    if (result){
        res.status(200).send('success')
    } else{
        res.status(500).send('failed')
    }
})
module.exports=reviewRouter