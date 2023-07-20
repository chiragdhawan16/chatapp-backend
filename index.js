import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"
import userRoute from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { Server } from "socket.io";
import Chat from "./models/chatModel.js"


const app=express()

dotenv.config();
app.use(cors())
app.use(express.json());
const PORT=process.env.PORT||8080

const connectDB=async()=>{
    try {
      
       const conn=await mongoose.connect(process.env.MONGO_URL);
       console.log("db connected")
    } catch (error) {
        console.log(error )
    }
}

connectDB();

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const eserver =app.listen(PORT, () => {
    console.log('Listening on PORT :' + PORT);
});

const io=new Server(eserver,{
   
    cors: {
      origin: "https://gleaming-dragon-7c7498.netlify.app",
      // credentials: true,
    },
});

let users=[];
io.on("connection",(socket)=>{
   

       socket.on("add user", (userid) => {
          
        if(users.length===0)
         {   
            
            users.push({userid:userid,socketid:socket.id})
            
        }
        else{
           if(!users.find(user=>user.userid===userid)) {
            users.push({userid:userid,socketid:socket.id})
           }
            
        }
        
      });

      socket.on("new message", async(newMessageRecieved,senderChat,senderid) => {
        if(users.length===0) return
          let chatUsers =await findUSerandChat(senderChat.chat._id)

          chatUsers.forEach((user) => {
           
            if (user ===senderid ) return;
              let socket_id=users.find(user1=>user1.userid===user)?.socketid
              socket.to(socket_id).emit("message recieved", senderChat.chat._id);
          //  console.log(user.socketid)
          //  socket.to(user.socketid).emit("message recieved", user);
          // if(users.find(user1=>user1.userid===user)?.socketid)
          // {
          //   let socket_id=users.find(user1=>user1.userid===user)?.socketid
          //   socket.to(socket_id).emit("message recieved", user);
          // }

          })
        //   socket.to(senderChat.chat._id).emit("message recieved", senderChat);
              
      });

})


  const findUSerandChat=async(chatid)=>{
    
    const chat = await Chat.findOne({ _id :chatid })
    return (chat.users.toString().split(","))


  }
  


