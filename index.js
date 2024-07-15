const express= require ('express')
const cors = require ('cors')
require('dotenv').config()
const connectDB= require('./config/connectDb')
const router= require ('./router/userRouter')
const cookieParser = require('cookie-parser')
const {app,server} = require('./socket/index')
// const app= express()

app.use(express.json())
app.use(cookieParser())
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
 
const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.json({
        message:"server running at port::-> ", PORT
    })
})

app.use('/api',router)
connectDB().then(()=>{
    server.listen(PORT,()=>{
      console.log("server running succesfully at port:"+PORT)
    })

})