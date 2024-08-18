import mongoose from "mongoose"
export const connectDB =async ()=>{
await mongoose.connect('mongodb+srv://priyankabarman1903:1604@cluster0.qycvfce.mongodb.net/food-delivery-website').then(()=>console.log("db connected"));
}