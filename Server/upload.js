const cloudinary=require('../Server/cloudinary.js')
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const db = require('./index.js');
const uploadRouter = express.Router();
const storage = multer.diskStorage({
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})
const upload = multer({ storage });
uploadRouter.post('/:productId', upload.single('image'), async (req, res) => {
  cloudinary.uploader.upload(req.file.path, async (err, result)=>{
    console.log('hihi');
    if(err){
      console.log(err)
      return res.status(400).json({message:'Error'})
    }
    const productId = req.params.productId;
    try {
      await db.upload(result.url,productId);
      res.send('File uploaded and resized successfully');
    } catch (error) {
      res.status(400).send('Error uploading and resizing file: ' + error.message);
    }
  })
});

module.exports = uploadRouter;
