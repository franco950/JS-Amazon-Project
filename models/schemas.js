const mongoose = require('mongoose');
const productSchema=mongoose.Schema({
    id:{type:String,required:true},
    image:{type:String,required:true},
    name:{type:String,required:true},
    rating:{
        stars: { type: Number, required: true, default: 0 }, 
        count: { type: Number, required: true, default: 0 }},
    quantity:{type:Number,default:0},
    priceCents:{type:Number,required:true},
    deliverydate:{type:Date},
    days:{type:Number}
},{timestamps:true})
const Product=mongoose.model('Product',productSchema)
const orderSchema=mongoose.Schema({
    userid:{type:String,required:true},
    products:{type:Array,required:true},
    overallcost:{type:Number,required:true},
    status:{type:String,required:true}
},{timestamps:true})
const Order=mongoose.model('Order',orderSchema)
module.exports = {
    Product,
    Order
  };
  