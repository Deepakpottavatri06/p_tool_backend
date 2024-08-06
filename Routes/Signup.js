import express from 'express';
import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res , next) => {
    let {name, email, password} = req.body;
    let existingUser;
    let hashedPassword;
    try{
        existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(400).json({"message":"user already exists"});
        }
        hashedPassword = await bcrypt.hash(password,12);
    }
    catch(err){
        return res.status(500).json({"message":"Server Error"});
    }
   

    const newUser = new User({
        name,
        email,
        password:hashedPassword
    });

    try{
        await newUser.save();
      
        const secretkey = process.env.JWT_SECRET;
        const token = jwt.sign({userId:newUser.id,email:newUser.email},secretkey,{expiresIn:'3h'});
        return res.json({
            "message":"User Created",
            "token":token
        })
       
    }
    catch(err){
        next();
        return res.status(500).json({"message":"Server Error"});
    }
});



export default router;


