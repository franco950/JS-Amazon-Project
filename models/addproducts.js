const mongoose = require('mongoose');
const {Product,Order}=require('./schemas')
const productlist=require('../data/productslist')



async function addProducts() {
try {
  mongoose.connect('mongodb://localhost:27017/AMAZON');
  await Product.insertMany(productlist);
  console.log('Products added successfully!');
  mongoose.connection.close(); 
} catch (error) {
  console.error('Error adding products:', error);
}
}
async function addOrders(orderData) {
  try {
    await Order.create(orderData);
    console.log('Order added successfully!');
  } catch (error) {
    console.error('Error placing order:', error);
  } finally {
    mongoose.connection.close();  
  }
}
async function searchProducts(...args) {
  try {
    await Order.find({...args});
    console.log('Order found!');
  } catch (error) {
    console.error('Error finding order:', error);
  } finally {
    mongoose.connection.close();  
  }
}

module.exports=addOrders