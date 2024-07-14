const UserModel = require('../models/userModel');

const bcryptjs = require ("bcryptjs")
async function registerUser(req,res){
    try {
        const {name, email, password, profile_pic}= req.body
        // console.log("api called sucessfullyyy")
        // console.log(name, email, password, profile_pic);
        const checkEmail= await UserModel.findOne({email:email})
        if(checkEmail){
          // console.log("User is already exist")
           return res.status(400).json({
            message:"User is already exist",
            error:true
           })
        }
           const salt=await bcryptjs.genSalt(10)
           const hashpassword = await bcryptjs.hash(password,salt)
           const payload={
               name,
               email,
               profile_pic,
               password:hashpassword
           }
           const user= new UserModel(payload)
           const userSave= await user.save()
           console.log("before return",userSave)
        return res.status(201).json({
            message:"user registered successfully",
            data:userSave,
            success:true
        })

    } catch (error) {
      return res.status(500).json({
        message:error.message||error,
        error:true
      })  
    }

}

module.exports =registerUser