import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, getUserOrders, listOrders } from "../controllers/orderControllers.js"; // Ensure filename matches


const orderRouter = express.Router();
console.log("✅ Order Routes Loaded");

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.get("/userorders", authMiddleware, getUserOrders); // Added route for fetching user orders
orderRouter.get("/list", authMiddleware, listOrders);

export default orderRouter;
