import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const LoginUser = async (req, res) => {
    const {email,password}=req.body;
    try{
       const user=await userModel.findOne({email});
       if(!user){
        return res.json({success:false,message:"User does not exist"});
       }
       const  isMatch =await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.json({success:false,message:"invalid credential"})
       }
        const token =createToken(user._id);
        res.json({success:true,token})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})  
    }
};

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log("User already exists");
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            console.log("Invalid email format");
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            console.log("Weak password");
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success:true, token });
    } catch (error) {
        console.log("Error occurred:", error);
        res.json({ success:false, message: "Error" });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

export { LoginUser, registerUser };
