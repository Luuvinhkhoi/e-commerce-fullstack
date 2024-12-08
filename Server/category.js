const express=require('express')
const db=require('./index.js')
const categoryRouter = express.Router();
categoryRouter.get('/:category_name', async (req, res, next)=>{
    console.log('product')
    const product= await db.getProductFromDatabaseByCategoryName(req.params.category_name);
    if(product){
        res.status(200).send(product)
    } else{
        res.status(404).send()
    }
})
module.exports=categoryRouter