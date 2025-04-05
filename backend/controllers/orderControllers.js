import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

stripe.balance.retrieve()
  .then(balance => console.log("Stripe Connected:", balance))
  .catch(err => console.error("Stripe Connection Error:", err));

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    // Validate request body
    const { userId, items, amount, address } = req.body;
    
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items array" });
    }

    if (typeof amount !== "number" || amount < 50) {
      return res.status(400).json({ success: false, message: "Minimum order amount should be ₹50" });
    }

    // Convert amount to paise for Stripe
    const amountInPaise = Math.round(amount * 100);

    // Create new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    // Prepare line items for Stripe checkout
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name || "Unnamed Item",
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity || 1,
    }));

    // Validate all line items have valid prices
    if (line_items.some(item => isNaN(item.price_data.unit_amount) || item.price_data.unit_amount <= 0)) {
      return res.status(400).json({ success: false, message: "Invalid item prices" });
    }

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, // ₹2 converted to paise
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log("Stripe session URL:", session.url);

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: "Error processing payment", error: error.message });
  }
};

const verifyOrder = async (req, res) => {
  console.log("Payment verification request received:", req.body); // Debugging log

  try {
  const { success, orderId } = req.body;

      console.log("Payment verification request received:", req.body);

      if (!orderId) {
          return res.status(400).json({ success: false, message: "Order ID is missing" });
      }

      if (success) {
          const updatedOrder = await orderModel.findByIdAndUpdate(
              orderId,
              { status: "Paid" },
              { new: true }
          );

          if (!updatedOrder) {
              return res.status(404).json({ success: false, message: "Order not found" });
          }

          console.log("✅ Order updated in MongoDB:", updatedOrder);
          return res.json({ success: true, message: "Payment verified", order: updatedOrder });
      } else {
          console.log("❌ Payment failed, order not updated.");
          return res.status(400).json({ success: false, message: "Payment failed" });
      }
  } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.json({ success: true, orders: [], message: "No orders found" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//listing order for the admin panel
const listOrders=async(req,res)=>
{
     try{
     const orders = await orderModel.find({});
     res.json({success:true,data:orders})
     }catch(error){
            console.log(error);
            res.json({success:false,message:"Error"})
     }
}

export { placeOrder, verifyOrder, getUserOrders,listOrders };
