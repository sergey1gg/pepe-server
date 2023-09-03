const express = require('express');
const http = require('http');
const path=require("path")
const mongoose = require("mongoose");
const config = require("config");
const corsMiddleware = require("./middlewares/cors.middleware");
const productsRouter = require("./routes/itemsRouter");
const app = express();
const server = http.createServer(app);

const PORT = config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json());

app.use('/public/tovars', express.static(path.join(__dirname, 'public', 'tovars')));
app.use('/api/products', productsRouter); 

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.get("dbUrl"))

    server.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
start();
