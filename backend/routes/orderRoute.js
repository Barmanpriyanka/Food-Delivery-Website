import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder } from "../controllers/orderControllers.js"; // Ensure filename matches

const orderRouter = express.Router();
console.log("✅ Order Routes Loaded");

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder); // ✅ Fixed router name

export default orderRouter;
