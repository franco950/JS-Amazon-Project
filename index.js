const {Product,Order}=require('./models/schemas')
const addOrders=require('./models/addproducts')
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
        if (products.length==0){console.log('no products found')}
        else{
        res.json(products);
        mongoose.connection.close();
        console.log('products sent to frontend successfully')}
         
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({message:error.message})}})
       


app.post('/api/orders',async(req,res)=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/AMAZON')
        console.log('connected to mongodb')
        const orders = await req.body
        await addOrders(orders)
        console.log('order received successfully')
        res.status(200).json({message:' order received successfully'})
        
    }catch(error){
        console.error('Error posting order:', error);
        res.status(500).json({message:error.message})
    }})
app.get('/api/orders',async(req,res)=>{
    try{
        const user=req.headers['userid']
        await mongoose.connect('mongodb://127.0.0.1:27017/AMAZON')
        console.log('connected to mongodb')
        const orders = await Order.find({userid: user})
        if (orders.length==0){console.log('no orders found')}
        else{
        res.json(orders);
        mongoose.connection.close();
        console.log('orders sent to backend successfully')}
            
    }catch(error){
        console.error('Error fetching orders:', error);
        res.status(500).json({message:error.message})}})

app.listen('3000',()=>console.log('listening on port 3000'))
/*app.get('/api/products/find',async(req,res)=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/AMAZON')
        console.log('connected to mongodb')
        const params = await Product.find({})
        res.json(products);
        mongoose.connection.close();
        console.log('products sent to frontend successfully')
            
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({message:error.message})}})*/