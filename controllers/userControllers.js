import User from "../models/userModel.js"

import { hashPassword, comparePassword }from "../helpers/authHelper.js";

import jwt from"jsonwebtoken";


 export const registerController = async (req, res) => {
  try {
  const data = req.body;
  const email = data.email;
  let password = data.password;
  let profilepic=data.profilepic
  const username = data.username;
  //  validation
  if (!email || !password || !username) {
    return res.send({message:'please enter email, password or username'}) 
  }
    
  // find existing one
  const existinguser = await User.findOne({ email });
  if (existinguser) {
    return res.send({message:'Email already exist database!'})
    
  }
  
 password=await hashPassword(data.password);
  if(profilepic===""){
    profilepic="https://firebasestorage.googleapis.com/v0/b/chatapp-997b5.appspot.com/o/noiamge.jpg?alt=media&token=61899453-a0b1-4600-a26e-d289f4eaf44f"
    }
    
    const newuser = new User({
      username: username,
      email: email,
      password: password,
      pic:profilepic
    });
    
  const user = await newuser.save();

  const userfortoken = await User.findOne({ email });
  
    const token = jwt.sign({ id: userfortoken._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
  
    return res.status(200).send({
      success: true,
      message: "Register successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic:user.pic,
      },
      token
    });
  } catch (err) {
      res.status(500).send({
      success: false,
      message: "Error in registeration",
      err
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const data = req.body;
    const email = data.email;
    let password = data.password;

    //  validation
    if (!email || !password) {
      return res.send({message:'Invalid email or password'})
      
    }

    // find existing one
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({message:'Email not Found in database!'})
    }
    
    
    const match=await comparePassword(password,user.password)

    
    if (!match) {
      return res.send({message:'Entered wrong password'})
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).send({
      success: true,
       message: "login successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic:user.pic,
      },
      token,
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      err
    });
  }
};

export const getallusers=async (req, res) => {
  
  const keyword = req.query.search
    ? {
        "$or": [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // const keyword = req.query.search
  
  try {
  const users=await User.find(keyword).sort({ _id: -1 })
      
      if(users)
      {
          res.status(200).send({
              success: true,
              message: "Successfully got all users",
              users,
            });  
      }
     
  } catch (error) {
      
      res.status(400).send({
          success: false,
          message: "Error in getting users all users",
          error,
        })
  }
  
}


