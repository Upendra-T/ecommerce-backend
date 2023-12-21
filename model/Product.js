const mongoose=require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
    title: {type:String,required:true},
    description: String,
    price: {type:Number,min:[0,"wrong price"]},
    stock: {type:Number,min:[1,"wrong stock"]},
    discountPercentage: {type:Number,min:[0,"discont"],max:[70,"wrong discount"]},
    rating: {type:Number,min:[0,"wrong rating"],max:[5,"wrong rating"]},
    brand:{type:String,required:true},
    category:{type:String,required:true},
    thumbnail: {type:String,required:true},
    images:[String]
  });


exports.Product=mongoose.model('Product',productSchema);