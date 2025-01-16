import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import paypal from '@paypal/checkout-server-sdk';

// PayPal configuration
const Environment = process.env.NODE_ENV === 'production' ? 
    paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
));

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Create a new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare PayPal order items
        const items = req.body.items.map(item => ({
            name: item.name,
            unit_amount: {
                currency_code: 'INR',
                value: (item.price * 80).toFixed(2) // Assuming 1 USD = 80 INR
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        items.push({
            name: "Delivery Charges",
            unit_amount: {
                currency_code: 'INR',
                value: (2 * 80).toFixed(2) // Example delivery charge
            },
            quantity: 1
        });

        // Create PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "INR",
                    value: (req.body.amount * 80 + 2 * 80).toFixed(2), // Total amount
                    breakdown: {
                        item_total: {
                            currency_code: "INR",
                            value: (req.body.amount * 80).toFixed(2)
                        },
                        shipping: {
                            currency_code: "INR",
                            value: (2 * 80).toFixed(2) // Delivery charges
                        }
                    }
                },
                items: items
            }],
            application_context: {
                return_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            }
        });

        // Execute the request
        const order = await paypalClient.execute(request);

        // Send PayPal approval URL to the client
        res.json({ success: true, approval_url: order.result.links.find(link => link.rel === 'approve').href });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error processing PayPal payment" });
    }
};

export { placeOrder };
