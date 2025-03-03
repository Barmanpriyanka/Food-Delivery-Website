import express from "express"
import authMiddleware from "../middleware/auth.js"
import {placeOrder} from "../controllers/orderControllers.js"

const orderRouter = express.Router();
console.log("Order Route Loaded");
orderRouter.post("/place",authMiddleware,placeOrder);
export default orderRouter;

