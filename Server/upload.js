const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const db = require('./index.js');
const uploadRouter = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage });

uploadRouter.post('/:productId', upload.single('image'), async (req, res) => {
  console.log('hihi');
  const productId = req.params.productId;
  const fileBuffer = req.file.buffer;
  const sizes = [
    { width: 300, height: 500 },
    { width: 600, height: 800 },
    { width: 1200, height: 1600 }
  ];

  try {
    await Promise.all(
      sizes.map(async (size) => {
        const resizeBuffer=await sharp(fileBuffer).resize(size.width, size.height).toBuffer();
        await db.upload(resizeBuffer,productId, size.width, size.height);
      })
    );
    res.send('File uploaded and resized successfully');
  } catch (error) {
    res.status(500).send('Error uploading and resizing file: ' + error.message);
  }
});

module.exports = uploadRouter;
