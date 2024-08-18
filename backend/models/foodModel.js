import mongoose from "mongoose";

const  foodSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,rquired:true},
    price:{type:Number,rquired:true},
    image:{type:String,rquired:true},
    category:{type,required:true}
})
const foodModel = mongoose.models.food || mongoose.model("food",foodSchema);

export default foodModel;