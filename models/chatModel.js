import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pic: {
      type: "String",
      default:
        "https://firebasestorage.googleapis.com/v0/b/chatapp-997b5.appspot.com/o/noiamge.jpg?alt=media&token=61899453-a0b1-4600-a26e-d289f4eaf44f",
    },
  },
  { timestamps: true }
);


export default mongoose.model("Chat", chatSchema);
  