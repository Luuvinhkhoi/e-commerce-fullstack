const express=require('express')
const productRouter = express.Router();
const db=require('./index.js')
let flashSaleEndTime = new Date();
flashSaleEndTime.setHours(0, 0, 0, 0); // Mặc định 0h sáng UTC mỗi ngày
const pagination = (req, res, next) => {
    const { pageNumber, pageSize } = req.query;
    req.pagination = {
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        offset: (pageNumber - 1) * pageSize,
    };

    next();
};
productRouter.get('/',pagination,async(req, res, next)=>{
    try {
        const { offset, pageSize } = req.pagination;
        const [products, count] = await Promise.all([
            db.getAllProductFromDatabase(offset, pageSize), 
            db.countTotalProduct()
        ]);
        res.status(200).send({products:products,count:count });
    } catch (error) {
        console.error("Error fetching products and categories:", error);
        res.status(500).send("Error fetching data");
    }
})
productRouter.get('/best-seller', async(req,res,next)=>{
    const bestSellerProduct= await db.getBestSeller()
    res.send(bestSellerProduct)
})
productRouter.get('/discount', async(req,res,next)=>{
    const discountProduct= await db.getDiscountItem()
    res.send(discountProduct)
})
productRouter.get('/trending', async(req, res, next) =>{
    const trendingProduct=await db.getTrendingItem()
    res.send(trendingProduct)
})
productRouter.get('/feature-book', async(req, res, next)=>{
    const featureProduct=await db.getFeatureBook()
    res.send(featureProduct)
})
productRouter.get('/search', async(req, res, next) =>{
  try{  
    const {name}=req.query
    const product=await db.findBookByName(name)
    res.status(200).send(product)
  } catch(error){
    res.status(500).send(err)
  }  
})
// Route lấy thời gian kết thúc flash sale
productRouter.get('/discount/flash-sale-endtime', (req, res) => {
  if (new Date() > flashSaleEndTime) {
    // Reset flash sale endTime cho ngày mới
    flashSaleEndTime = new Date();
    flashSaleEndTime.setHours(0, 0, 0, 0);
    flashSaleEndTime.setDate(flashSaleEndTime.getDate() + 1);
  }
  res.json({ endTime: flashSaleEndTime });
});
productRouter.get('/filter',pagination ,async(req, res, next)=>{
    const { category, publisher, format, minPrice, maxPrice } = req.query;
    const { offset, pageSize } = req.pagination;
    const min=parseFloat(minPrice)
    const max=parseFloat(maxPrice)
    console.log(category,publisher, format, offset,minPrice, maxPrice, pageSize)
    const filterProduct= await db.filterProduct(category, publisher, format, min, max, pageSize, offset)            
    const count=await db.countFilterProduct(category, publisher, format, min, max)

    res.send({filterProduct: filterProduct, count: count})
}
)
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