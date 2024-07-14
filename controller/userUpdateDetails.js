const getUserDetailFormToken = require("../helpers/gerUserDetaisFromToken")
const UserModel = require("../models/userModel")

async function updateUserDetails(req,res){
    try {
        console.log("api reached ot lkajfdlk");
        const token = req.cookies.token||""
        console.log("token in update---",token) 
        const user= await getUserDetailFormToken(token)
        console.log("ppppppppppppppppp",user) 
   

        const {name,profile_pic}=req.body
        console.log("req.body",name,profile_pic);

        const updateUser=await UserModel.updateOne({_id:user._id},{
            name,
            profile_pic
        })
        const userInformation= await UserModel.findById(user._id)
        console.log("userInformation",userInformation);
        return res.json({
            message:"Profile updated successfully",
            data:userInformation,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true
        })
    }
}

module.exports=updateUserDetails

// } catch (error) {
//     return res.status(500).json({
//         message:error.message||error,
//         error:true
//     })
// }