const Product=require('./models/productSchema')
const express=require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app=express()
app.use(express.json())
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));


app.get('/api/products',async(req,res)=>{
try{
    await mongoose.connect('mongodb://127.0.0.1:27017/AMAZON')
    console.log('connected to mongodb')
    const products = await Product.find({})
    res.json(products);
    console.log('products sent to frontend successfully')
    
}catch(error){
    console.error('Error fetching products:', error);
    res.status(500).json({message:error.message})
}})
app.listen('3000',()=>console.log('listening on port 3000'))
