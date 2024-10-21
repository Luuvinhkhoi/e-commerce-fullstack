const express=require('express')
const allProductRouter=require('express').Router();
const categoryRouter = express.Router({mergeParams: true});
const productRouter = express.Router({mergeParams: true});
const db=require('./index.js')
allProductRouter.get('/',async(req, res, next)=>{
    try {
        const [products, categories] = await Promise.all([
            db.getAllProductFromDatabase(), 
            db.getAllCategoryFromDatabase()   
        ]);
        res.status(200).send({
            products: products,
            categories: categories
        });
    } catch (error) {
        console.error("Error fetching products and categories:", error);
        res.status(500).send("Error fetching data");
    }
})
allProductRouter.use('/category', categoryRouter)
allProductRouter.use('/product', productRouter)
categoryRouter.get('/:category_name', async (req, res, next)=>{
    const product= await db.getProductFromDatabaseByCategoryName(req.params.category_name);
    if(product){
        res.status(200).send(product)
    } else{
        res.status(400).send()
    }
})
productRouter.get('/:product_id', async (req, res, next) => {
    const product=await db.getProductFromDatabaseById(req.params.product_id);
    if(product){
        res.status(200).send(product)
    } else{
        res.status(400).send()
    }
});
module.exports=allProductRouter