const  UserModel = require("../models/userModel")

async function SearchUser(req,res){
   try {
     const {search}=req.body
      const query= new RegExp(search,"i","g")
      const user= await UserModel.find({
        "$or":[
            {name:query},
            {email:query}
        ]
      }).select("-password")
      return res.json({
        message:'all User',
        data:user,
        succes:true
      })
   } catch (error) {
    return res.status(500).json({
        message:error.message || error,
        error:true
    })
   }
}
module.exports = SearchUser