import jwt from "jsonwebtoken"
const authMiddleware = async (req, res, next) => {
    let token;
    
    // Check for token in multiple locations
    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.headers.token) {
        token = req.headers.token;
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decode.id }; // Store user info in req.user
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Invalid or expired token" });
    }
}


export default authMiddleware;