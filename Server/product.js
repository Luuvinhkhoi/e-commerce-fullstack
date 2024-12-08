const express=require('express')
const productRouter = express.Router();
const db=require('./index.js')
productRouter.get('/',async(req, res, next)=>{
    try {
        const [products] = await Promise.all([
            db.getAllProductFromDatabase(), 
        ]);
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products and categories:", error);
        res.status(500).send("Error fetching data");
    }
})
productRouter.get('/related_product/:product_id', async(req, res, next)=>{
    const relatedProduct= await db.getRelatedProduct(req.params.product_id)
    res.send(relatedProduct)
})
productRouter.get('/product_images/:product_id', async(req, res, next)=>{
    const product_images=await db.getProductImageFromDatabaseById(req.params.product_id)
    res.send(product_images)
})
productRouter.get('/:product_id', async (req, res, next) => {
    const product=await db.getProductFromDatabaseById(req.params.product_id);
    if(product){
        res.status(200).send(product)
    } else{
        res.status(404).send()
    }
});
productRouter.post('/', async (req, res, next)=>{
    const {product_name, description, price, quantity, category_id}= req.body;
    try{
      const result=await db.createProduct(product_name, description, price, quantity, category_id)
      res.status(200).send(result)
    } catch(err){
      res.status(500).send(err)
    }
});
productRouter.patch('/:product_id', async (req, res) => {
    const id=req.params.product_id;
    console.log(id)
    try{
      const result=await db.updateProduct(id, req.body);
      res.status(200).send(result)
    } catch(err){
      res.status(500).send(err)
    }
});
productRouter.delete('/:product_id', async(req, res)=>{
    const id=parseInt(req.params.product_id,10)
    try{
        const result=await db.deleteProductById(id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
productRouter.delete('/:product_id', async(req, res)=>{
    try{
        const result=await db.deleteAllProduct()
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
module.exports=productRouter