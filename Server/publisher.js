const express=require('express')
const db=require('./index.js')
const publisherRouter = express.Router();
publisherRouter.get('/', async(req, res, next)=>{
    const result=await db.getPublisher()
    if (result){
        res.status(200).send(result)
    } else{
        res.status(404).send()
    }
})

module.exports=publisherRouter