const Product=require('./models/productSchema')
const express=require('express')
const mongoose = require('mongoose');
const app=express()
app.use(express.json())
app.listen('3000',()=>console.log('listening on port 3000'))

app.get('/',(req,res)=>res.send('hello from node api'))
app.get('/products',async(req,res)=>{
try{
    const products=await Product.find({})
}catch{
    res.status(500).json({message:error.message})
}})
app.post('/api/products',(req,res)=>res.send(req.body))
mongoose.connect('mongodb://127.0.0.1:27017').then(()=>{console.log('connected to mongodb')})
 .catch(()=>{console.log('error connecting to mongodb')});