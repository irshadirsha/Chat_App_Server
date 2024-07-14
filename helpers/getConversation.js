const { conversationalModel } = require("../models/ConversationModel")

const getConversation=async(currentUserId)=>{
    if(currentUserId){
        const currentUserConversation= await conversationalModel.find({
            "$or":[
                {sender:currentUserId},
                {receiver:currentUserId}
            ]
        }).sort({updatedAt:-1}).populate('message').populate('sender').populate('receiver')

        console.log("currentUserConversation",currentUserConversation)

        const conversation= currentUserConversation.map((conv)=>{
            const unSeenMsg = conv.message.reduce((preve,curr)=>{
                const MsgbyUserId= curr?.MsgbyUserId?.toString()

                if(MsgbyUserId !== currentUserId){
                    return preve + (curr?.seen ? 0 : 1)
                }else{
                    return preve
                }
            },0)
            return{
                id:conv?._id,
                sender:conv?.sender,
                receiver:conv?.receiver,
                unseen:unSeenMsg,
                lastMsg:conv.message[conv?.message?.length-1]
            }
        })
           return conversation
    }else{
        return []
    }
}

module.exports = getConversation