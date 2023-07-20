import  express from "express";
 import { requireSignIn } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageControllers.js";

 const router = express.Router();


 router.get("/:chatId",requireSignIn,allMessages);
 router.post("/",requireSignIn, sendMessage);

export default router;
