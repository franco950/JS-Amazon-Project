const mongoose = require('mongoose');
const Product=require('./models/productSchema')
const productlist=require('./data/productslist')

mongoose.connect('mongodb://localhost:27017/AMAZON');

async function addProducts() {
try {
  await Product.insertMany(productlist);
  console.log('Products added successfully!');
  mongoose.connection.close(); 
} catch (error) {
  console.error('Error adding products:', error);
}
}

addProducts();