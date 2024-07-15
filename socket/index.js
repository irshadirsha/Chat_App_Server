const express  = require('express')
const {Server} = require("socket.io")
const http = require ('http')
const getUserDetailFormToken = require('../helpers/gerUserDetaisFromToken')
const UserModel = require('../models/UserModel')
const { conversationalModel, messageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')

const app= express()

const server=http.createServer(app)

const io= new Server(server,{
    cors:{
        origin:process.env.FRONTEND_URL,
        credentials:true
    }
})
const onlineUser = new Set()

io.on('connection',async(socket)=>{
        console.log('user connected-----:',socket.id)
        const token = socket.handshake.auth.token
        const user = await getUserDetailFormToken(token)


        socket.join(user?._id?.toString())
        onlineUser.add(user?._id?.toString())

        io.emit('onlineUser',Array.from(onlineUser))

        socket.on('message-page',async(userId)=>{
            console.log("userId",userId)
            const userDetails= await UserModel.findById(userId).select("-password")
            const payload={
                name:userDetails?.name,
                _id:userDetails?._id,
                email:userDetails?.email,
                profile_pic:userDetails?.profile_pic,
                online:onlineUser.has(userId)
            }
            socket.emit("message-user",payload)
            // to fidn and send previous message
            const getConversationalMessage= await conversationalModel.findOne({
                "$or":[
                    {sender:userId,receiver:user?._id},
                    {sender:user?._id, receiver:userId}
                ]
             }).populate('message').sort({updatedAt:-1})
          socket.emit('message',getConversationalMessage?.message||[])
        })
    
        socket.on('new-message',async(data)=>{
             // check the previous message for shoeing 
        let conversation = await conversationalModel.findOne({
            "$or":[
                {sender:data?.sender, receiver:data?.receiver},
                {sender:data?.receiver, receiver:data?.sender}
            ]
        })
         if(!conversation){
        const createConversation = await conversationalModel({
            sender:data?.sender,
            receiver:data?.receiver
            }) 
            conversation =await createConversation.save()
         }
        const message = new messageModel({
            text:data?.text,
            imageUrl:data?.imageUrl,
            videoUrl:data?.videoUrl,
            MsgbyUserId:data?.MsgbyUserId
        })
        const savedMessage = await message.save()
        
        const updateConversation =await conversationalModel.updateOne({_id:conversation?._id},{
            "$push":{message:savedMessage?._id}
         })

         const getConversationalMessage= await conversationalModel.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver, receiver:data?.sender}
            ]
         }).populate('message').sort({updatedAt:-1})
         io.to(data?.sender).emit('message',getConversationalMessage?.message||[])
         io.to(data?.receiver).emit('message',getConversationalMessage?.message||[])

         const converationSender=await getConversation(data?.sender)
         const converationReceiver=await getConversation(data?.receiver)

         io.to(data?.sender).emit('conversation',converationSender)
         io.to(data?.receiver).emit('conversation',converationReceiver)

        })


        socket.on('sideBar',async(currentUserId)=>{
            console.log("current user id------",currentUserId )
            const conversations= await getConversation(currentUserId)
            console.log("conversations.....",conversations)
            socket.emit('conversation',conversations)
        })

        socket.on('seen',async(MsgbyUserId)=>{
            let conversation = await conversationalModel.findOne({
                "$or":[
                    {sender:user?._id, receiver:MsgbyUserId},
                    {sender:MsgbyUserId, receiver:user?._id}
                ]
            })

            const conversationMessageId= conversation?.message ||[]
            const updateMessages= await messageModel.updateMany(
                {_id:{'$in':conversationMessageId},MsgbyUserId:MsgbyUserId},
                {'$set':{seen:true}}
        )
        // to send conversation
        const converationSender=await getConversation(user?._id.toString())
        const converationReceiver=await getConversation(MsgbyUserId)

        io.to(user?._id.toString()).emit('conversation',converationSender)
         io.to(MsgbyUserId).emit('conversation',converationReceiver)

        })

         
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log("disconected user:",socket.id)
    })
})
module.exports={app,server}
