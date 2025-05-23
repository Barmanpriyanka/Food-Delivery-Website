import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js"; // Ensure this import is correct
import 'dotenv/config';
import orderRouter from "./routes/orderRoute.js";


// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter); 
app.use("/api/order",orderRouter);


app.get("/", (req, res) => {
    res.send("API Working");
});

const server = app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying alternative port...`);
        const newPort = port + 1;
        server.listen(newPort);
    } else {
        console.error('Server error:', err);
    }
});
