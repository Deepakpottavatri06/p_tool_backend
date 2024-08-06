import express  from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();
router.post("/login", async (req, res, next) => {
    let {email, password} = req.body;
    console.log("Got here");
    try{
        const existingUser  = await User.findOne({email:email});
        if(!existingUser){
                return res.status(400).json({"message":"Invalid Credentials"});
        }

        const match =  await bcrypt.compare(password,existingUser.password);
        if(!match){
            return res.status(400).json({"message":"Invalid Credentials"});
        }
        const secretkey = process.env.JWT_SECRET;
        const token = jwt.sign({userId:existingUser.id,email:existingUser.email},secretkey,{expiresIn:'3h'});
        return res.json({
            "message":"User Logged In",
            "token":token
        })
    }
    catch(err){
        next(err);
        return res.status(500).json({"message":"Server Error"});
    }
});
export default router;
