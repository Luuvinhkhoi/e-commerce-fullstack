const express=require('express')
const reviewRouter=express.Router()
const db=require('./index.js')
reviewRouter.get('/:product_id', async(req,res, next)=>{
    const result=await db.getReview(req.params.product_id)
    if(result){
        res.status(200).send(result)
    } else{
        res.status(404).send('failed')
    }
})
reviewRouter.get('/stat/:product_id', async(req,res, next)=>{
    const result=await db.getRatingScore(req.params.product_id)
    if(result){
        res.status(200).send(result)
    } else{
        res.status(404).send('failed')
    }
})
reviewRouter.post('/:product_id', async(req, res, next)=>{
    const {score,content}= req.body;
    console.log(req.body)
    const result= await db.addReview(score, content, req.params.product_id, req.user.user_id)
    if (result){
        res.status(200).send('success')
    } else{
        res.status(500).send('failed')
    }
})
module.exports=reviewRouter