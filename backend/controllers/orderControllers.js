import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Check Stripe connection
stripe.balance.retrieve()
  .then(balance => console.log("Stripe Connected:", balance))
  .catch(err => console.error("Stripe Connection Error:", err));

// Place a new order
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "https://food-delivery-frontendd-zpfd.onrender.com";

  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items array" });
    }

    if (typeof amount !== "number" || amount < 50) {
      return res.status(400).json({ success: false, message: "Minimum order amount is ₹50 (~$0.60)" });
    }

    // Create new order with default payment = false and status
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "Food Processing",
      payment: false
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    // Prepare Stripe line items
    const line_items = items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name || "Unnamed Item" },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity || 1
    }));

    // Validate prices
    if (line_items.some(item => isNaN(item.price_data.unit_amount) || item.price_data.unit_amount <= 0)) {
      return res.status(400).json({ success: false, message: "Invalid item prices" });
    }

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200
      },
      quantity: 1
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: "Error processing payment", error: error.message });
  }
};

// Verify payment and update order
const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body;

    if (!orderId) return res.status(400).json({ success: false, message: "Order ID is missing" });

    const updatedOrder = await orderModel.findById(orderId);
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    if (success) {
      updatedOrder.payment = true;
      // mark as Paid only after successful payment
      await updatedOrder.save();
      return res.json({ success: true, message: "Payment verified", order: updatedOrder });
    } else {
      return res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user orders sorted by latest first
const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Not authorized" });

    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// List all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.status(400).json({ success: false, message: "Order ID and status are required" });

    const allowedStatuses = ["Food Processing", "Out for Delivery", "Delivered"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { placeOrder, verifyOrder, getUserOrders, listOrders, updateOrderStatus };
