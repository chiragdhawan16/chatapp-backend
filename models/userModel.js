import  mongoose from"mongoose";
import bcrypt from "bcrypt";



const userSchema = mongoose.Schema(
  {
    username: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      default:
        "https://firebasestorage.googleapis.com/v0/b/chatapp-997b5.appspot.com/o/noiamge.jpg?alt=media&token=61899453-a0b1-4600-a26e-d289f4eaf44f",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestaps: true }
);
 export default mongoose.model("User", userSchema);
  
