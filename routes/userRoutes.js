import  express from "express";
import  {
  registerController,
  loginController,getallusers
} from "../controllers/userControllers.js";
 import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/register", registerController);
router.post("/login", loginController);
router.get("/",requireSignIn, getallusers);


export default router;
