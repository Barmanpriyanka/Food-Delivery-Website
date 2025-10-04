import mongoose from 'mongoose';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

dotenv.config();

const updateInvalidStatuses = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const allowedStatuses = ["Food Processing", "Out for Delivery", "Delivered"];

    const result = await orderModel.updateMany(
      { status: { $nin: allowedStatuses } },
      { $set: { status: "Food Processing" } }
    );

    console.log(`Updated ${result.modifiedCount} orders with invalid status to "Food Processing"`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating orders:', error);
  }
};

updateInvalidStatuses();
