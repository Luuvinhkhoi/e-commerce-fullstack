const cartRouter=require('express').Router();
const express=require('express')
const checkoutRouter = express.Router({mergeParams: true});
const db=require('./index.js')
require('dotenv').config()
const PayOs=require('@payos/node')
const cron = require("node-cron");
const payos= new PayOs(process.env.PAYOS_CLIENT_ID,process.env.PAYOS_API_KEY,process.env.PAYOS_CHECKSUM_KEY)
cartRouter.get('/',async(req, res, next)=>{
    try{
        const result=await db.getCartByUserId(req.user.user_id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cartRouter.post('/', async(req,res,next)=>{
    try{
        const {product_id, quantity}=req.body
        const result=await db.insertProductIntoCart(req.user.user_id, product_id, quantity)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})

cartRouter.use('/checkout', checkoutRouter)
checkoutRouter.post('/', async (req, res, next) => {
    try {
        const {name,phone_number,province, city, ward , address, payment_method, fee}=req.body
        const result=await db.checkout(req.user.user_id,province, city, ward, address,phone_number, payment_method, name, fee)  
        const order = {
            amount: parseInt(result.rows[0].shipping_fee)+parseInt(result.rows[0].total_price),
            description: 'Thanh toán sách',
            orderCode: result.rows[0].order_id,
            returnUrl: 'http://localhost:3000',
            cancelUrl: 'http://localhost:3000/cart'
        };
        
        const paymentLink = await payos.createPaymentLink(order);
        if (paymentLink && paymentLink.checkoutUrl) {
            return res.json({checkoutUrl:paymentLink.checkoutUrl});
        } else {
            return res.status(500).json({ error: 'Không lấy được checkoutUrl từ PayOS' });
        }
    } catch (error) {
        console.error('Lỗi khi tạo payment link:', error);
        return res.status(500).json({ error: 'Lỗi khi tạo payment link' });
    }
});
checkoutRouter.post('/cancel', (req,res)=>{
    try{
        db.cancelPayment(req.body.orderId)
    } catch(error){
        return res.status(500).json({error: 'Lỗi khi hủy thanh toán'})
    }
})
checkoutRouter.post('/receive-hook',(req, res)=>{
    console.log(req.body)
    db.updatePayment_status(req.body.data.orderCode)
    res.json()
})
/*checkoutRouter.post('/',async(req, res, next)=>{
    try{
        const {name,phone_number,province, city, ward , address, payment_method, fee}=req.body
        const result=await db.checkout(req.user.user_id,province, city, ward, address,phone_number, payment_method, name, fee)
        if (result){
            res.status(200).send('Checkout success')
        }
    } catch(error){
        res.status(500).send({message: error.message})
    }
})*/
cartRouter.put('/', async(req, res, next)=>{
    try{
        const result=await db.updateCart(req.user.user_id, req.body.updateData)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cartRouter.delete('/', async(req, res, next)=>{
    try{
        console.log('hihi')
        const result=await db.deleteProductInCartByProductId(req.user.user_id, req.body.id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
cron.schedule("*/10 * * * *", async () => {
    const expiredOrders = await db.getPendingOrdersOlderThan(30); // Lấy đơn hàng pending > 30 phút
    for (const order of expiredOrders) {
        await db.cancelPayment(order.order_id);
        console.log(`Đơn hàng ${order.order_id} đã bị hủy sau 30 phút`);
    }
});
module.exports=cartRouter