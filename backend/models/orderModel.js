import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },  // Fixed typo
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing", enum: ["Food Processing", "Out for Delivery", "Delivered"] },
  date: { 
    type: Date, 
    default: Date.now,
    get: (date) => date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  },
  payment: { type: Boolean, default: false }

},{ timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
