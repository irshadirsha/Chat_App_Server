const getUserDetailFormToken = require("../helpers/gerUserDetaisFromToken")

async function userDetail(req,res){
    try {
        const token =req.cookies.token||""
        // console.log("tokenin user deatails ----------->",token)
      const user = await getUserDetailFormToken(token)
      // console.log("======",user);
      return res.status(200).json({
        message:"user deatail",
        data:user
      })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true
        })
    }
}

module.exports= userDetail