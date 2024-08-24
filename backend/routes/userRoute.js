import express from "express"
import {LoginUser,registerUser} from "..//controllers/userController.js"

const  userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",
    LoginUser)
export default userRouter;



