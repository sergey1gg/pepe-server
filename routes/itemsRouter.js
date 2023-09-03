const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require("../models/Item");

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'tovars');
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.floor(Math.random() * 1000) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload', upload.array('images'), (req, res) => {
  const uploadedFiles = req.files.map(file => file.filename);
  res.status(200).json(uploadedFiles);
});

router.post('/addproduct', async (req, res) => {
  try {
    const newProduct = req.body.newProduct;
    console.log(newProduct)
    const product = new Product({
      name: newProduct.name,
      cost: newProduct.cost,
      shippingCost: newProduct.shippingCost,
      category: newProduct.category,
      colors: newProduct.colors,
      sizes: newProduct.sizes,
      images: newProduct.imgUrl,
      description: newProduct.description,
      details: newProduct.details,
      featured: newProduct.featured,
      newsDrop: newProduct.newsDrop,
      count: newProduct.count,
      ostatok: newProduct.count
    });
   await product.save();
    res.status(200).json({ message: 'Товар успешно добавлен!' });
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

router.get('/getproducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    res.status(500).json({ error: 'Ошибка при получении продуктов' });
  }
});

router.get('/getproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Ошибка при получении продукта по ID:', error);
    res.status(500).json({ error: 'Ошибка при получении продукта по ID' });
  }
});


module.exports = router;