const userRouter=require('express').Router();
const db=require('./index.js')
userRouter.get('/',async(req, res, next)=>{
    try{
        const result=await db.getAllUser()
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
userRouter.get('/:user_id', async (req, res, next)=>{
    try{
        const user= await db.getUserById(req.params.user_id);
        res.status(200).send(user)
    } catch(err){
        res.status(404).send(err)
    }
})
userRouter.post('/',db.createUser)
userRouter.patch("/:user_id", async(req, res, next)=>{
    const id=req.params.user_id;
    console.log(id)
    try{
      const result=await db.updateUser(id, req.body);
      res.status(200).send(result)
    } catch(err){
      res.status(500).send(err)
    }
})
userRouter.delete('/:user_id', async(req, res)=>{
    const id=parseInt(req.params.user_id,10)
    try{
        const result=await db.deleteUserById(id)
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
userRouter.delete('/', async(req, res)=>{
    try{
        const result=await db.deleteAllUser()
        res.status(200).send(result)
    } catch(err){
        res.status(500).send(err)
    }
})
module.exports=userRouter