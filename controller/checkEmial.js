const UserModel = require("../models/UserModel")

async function checkEmail(req,res){
  try {
    console.log("email api called successfully email controller",req.body)
    const {email}=req.body
    const checkmail= await UserModel.findOne({email}).select("-password")
    if(!checkmail){
        return res.status(400).json({
            message:"User not found",
            error:true
        })
    }
    console.log("email exist in database successfully")
    return res.status(200).json({
        message:"email verify",
        success:true,
        data:checkmail
    })
  } catch (error) {
    
  }
}
module.exports=checkEmail