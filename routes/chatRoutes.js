import express from "express";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup }  from "../controllers/chatControllers.js";
import {requireSignIn} from "../middleware/authMiddleware.js"
const router = express.Router();


 router.post("/",requireSignIn, accessChat);
 router.get("/",requireSignIn, fetchChats);
router.post("/group",requireSignIn, createGroupChat);
 router.put("/rename",requireSignIn, renameGroup);
 router.put("/groupremove",requireSignIn, removeFromGroup);
 router.put("/groupadd",requireSignIn, addToGroup);

export default router;
