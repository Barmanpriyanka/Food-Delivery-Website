import userModel from "../models/userModel.js";

// Add items to user cart 
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove items from user cart 
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist

        if (cartData[req.body.itemId]) {
            if (cartData[req.body.itemId] > 1) {
                cartData[req.body.itemId] -= 1;
            } else {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData }, { new: true });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.body.userId });
        const cartData = userData.cartData || {}; // Initialize cartData if it doesn't exist
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };
