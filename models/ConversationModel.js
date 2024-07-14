const mongoose = require('mongoose')

const messageSchema= new mongoose.Schema({
    text:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    MsgbyUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    }
},{
    timestamps:true
})

const conversationaSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    message:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
],
    
},{
    timestamps:true
})
const messageModel= mongoose.model("Message",messageSchema)
const conversationalModel= mongoose.model("conversation",conversationaSchema)

module.exports={
    messageModel,
    conversationalModel
}