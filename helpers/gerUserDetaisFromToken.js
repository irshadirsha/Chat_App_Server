const jwt= require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUserDetailFormToken = async(token)=>{
    // console.log("tokenin user helpers file ----------->",token)
    if(!token){
        return {
            message:"Session is out",
            logout:true
        }
    }
    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)

    const user = await UserModel.findById(decode.id).select("-password")
    
    return user
}
module.exports=getUserDetailFormToken

