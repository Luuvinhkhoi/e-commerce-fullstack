const express=require('express')
const db=require('./index.js')
const categoryRouter = express.Router();
const pagination = (req, res, next) => {
    const { pageNumber, pageSize } = req.query;
    req.pagination = {
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        offset: (pageNumber - 1) * pageSize,
    };

    next();
};
categoryRouter.get('/', async(req, res, next)=>{
    const result=await db.countItemInEachCategory()
    if (result){
        res.status(200).send(result)
    } else{
        res.status(404).send()
    }
})

categoryRouter.get('/category-filter',pagination ,async (req, res, next)=>{
    const { offset, pageSize } = req.pagination;
    const format = null
    const publisher=null
    const min=null
    const max=null
    console.log(req.query, publisher, format, min, max, pageSize, offset)
    const [products, count] = await Promise.all([
            db.filterProduct(req.query.category, publisher, format, min, max, pageSize, offset), 
            db.countItemInEachCategory()
    ]);
    console.log(products)
    if(products){
        res.status(200).send({filterProduct: products, count: count})
    } else{
        res.status(404).send()
    }
})

module.exports=categoryRouter