const imageRouter=require('express').Router();
const db=require('./index.js')

imageRouter.get('/', async (req, res, next)=>{
    try{
        const result=await db.getAllImage()
        const base64Image = result.map(image => ({ data: Buffer.from(image.data).toString('base64') }));
        res.json(base64Image)
    } catch(error){
        res.status(500).send(error.message)
    }
})
module.exports=imageRouter