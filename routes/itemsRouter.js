const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require("../models/Item");
const axios = require("axios")
const nodemailer = require('nodemailer');
const Transaction=require("../models/Transactions")
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru', 
  port: 465, 
  auth: {
    user: 'sergeyleb66@mail.ru', 
    pass: 'ycVqgpZRnbtzkM2r0DCp'
  }
});
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

router.get('/getprice/:symbol/:convert/:id', async (req, res) => {
  try {
    const { symbol, convert, id } = req.params;



    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${symbol}&convert=${convert}`, {
      headers: {
        'X-CMC_PRO_API_KEY': "553efc72-43ae-4801-8fcd-c7b039e666ae",
      },
    });

    const price = response.data; 

    res.status(200).json({ price, id });
  } catch (error) {
    console.error('Ошибка получения цены', error);
    res.status(500).json({ error: 'Ошибка при получении цены'});
  }
});

router.get('/getpondprice/:symbol/:convert/:id', async (req, res) => {
  try {
    const { symbol, convert, id } = req.params;



    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${symbol}&convert=${convert}`, {
      headers: {
        'X-CMC_PRO_API_KEY': "553efc72-43ae-4801-8fcd-c7b039e666ae",
      },
    });

    const price = response.data; 

    res.status(200).json({ price, id });
  } catch (error) {
    console.error('Ошибка получения цены', error);
    res.status(500).json({ error: 'Ошибка при получении цены'});
  }
});

router.get('/checktr/:address/:email/:value/:pondCount/:paymentInfo/:cart', async (req, res) => {
  try {
  
    const { email, address, value, pondCount, paymentInfo, cart } = req.params;

    const response = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=0x11Ee12594aEcF93B6941cFF29A01074d6A899FdF&startblock=0&endblock=99999999&sort=asc&apikey=ATM55BIYAJPZMSZ22KQCEMH7Y6XV768NE6`);
    console.log(response.data.result)
    const filteredResults = [];
    let result=false
    for (const item of response.data.result) {

      const existingTransaction = await Transaction.findOne({ blockNumber: item.blockNumber });

      if (!existingTransaction && (item.tokenSymbol === 'PEPE' && item.value.includes(value) || (item.tokenSymbol === 'POND' && item.value.includes(pondCount))) && item.from===address.toLowerCase() ) {
        // Сохранение транзакции в базе данных
        const transaction = new Transaction({
          blockNumber: item.blockNumber,
          from: item.from.toLowerCase(),
          to: item.to.toLowerCase(),
          tokenSymbol: item.tokenSymbol,
          value: item.value,
        });
        await transaction.save();
        filteredResults.push(item);

        const mailOptions = {
          from: 'sergeyleb66@mail.ru',
          to: `${email}`,
          subject: '',
          html: '<div><h2>Thank you for placing the order, we will send you a tracking code soon.</h2><img src="/email.jpg"/></div>'
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('err:', error);
          } else {
            console.log('suss:', info.response);
          }
        });
         const paymentInfojson = JSON.parse(paymentInfo);
  const botToken = '5318096111:AAEm9vCW5cDxYMeuu4HmmSm1h2YOm7m30r0';
  const chatIds = [1638526644,567152294];
  const filterCart = JSON.parse(cart).map(cartItem => ({
    name: cartItem.product.name,
    cost: cartItem.product.cost,
    shippingCost: cartItem.product.shippingCost,
    color: cartItem.color,
    quantity: cartItem.quantity,
    size: cartItem.size
  }));
  
  const paymentInfoText = `
    Email: ${paymentInfojson.email}
    Country: ${paymentInfojson.country}
    City: ${paymentInfojson.city}
    Address: ${paymentInfojson.address}
    Apartment: ${paymentInfojson.apartment}
    Post Code: ${paymentInfojson.postCode}
    Phone: ${paymentInfojson.phone}
    First Name: ${paymentInfojson.firstName}
    Last Name: ${paymentInfojson.lastName}
  `;
  
  const cartText = filterCart.map(item => `
    Product: ${item.name}
    Cost: ${item.cost}
    Shipping Cost: ${item.shippingCost}
    Color: ${item.color}
    Quantity: ${item.quantity}
    Size: ${item.size}
  `).join('\n\n');
  
  const message = `Новый платеж\n${paymentInfoText}\n\nПокупка:\n\n${cartText}`;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  async function sendTelegramMessage(chatId, text) {
    try {
      const params = {
        chat_id: chatId,
        text: text,
      };
      const response = await axios.post(apiUrl, params);
      console.log('Сообщение успешно отправлено:');
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  }
  
  chatIds.forEach((chatId) => {
    sendTelegramMessage(chatId, message);
  });
        result=true;
        res.status(200).json({ result });
      }
      else{
        result=false
        res.status(200).json({ result });
      }

    }

  } catch (error) {
    console.error('Ошибка получения цены', error);
    res.status(500).json({ error: 'Ошибка при получении цены'});
  }
});


module.exports = router;

//admin@ml.ru
//ED58620D44090A4AE6A8C1D090C7C1B18453
//smtp.elasticemail.com
//2525
//&& item.value.includes(value) && item.from===address.toLowerCase() 