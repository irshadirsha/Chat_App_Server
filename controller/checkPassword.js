const UserModel = require("../models/UserModel")
const bcryptjs = require ("bcryptjs")
const jwt= require ('jsonwebtoken')
require('dotenv').config();
async function checkPassword(req,res){
        try {
            console.log("reached");
        const {password, userId}=req.body
        console.log("email api called successfully email passowrd")
        console.log(password, userId)
        const user= await UserModel.findById(userId)
        const verifypassword = await bcryptjs.compare(password,user.password)
        if(!verifypassword){
            return res.status(400).json({
                message:"Please check the Password",
                error:true
            })
        }
        const tokenData={
            id:user._id,
            email:user.email
        }
        const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
        const cookieOptions= {
            // http:true,
            // secure:true,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
        }

        return res.cookie('token',token,cookieOptions).status(200).json({
            Message:"Login successfully",
            token:token,
            succuss:true
        })
    
    
} catch (error) {
    return res.status(500).json({
        message:error.message||error,
        error:true
    })
}
}

module.exports=checkPassword