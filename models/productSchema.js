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
module.exports = Product;