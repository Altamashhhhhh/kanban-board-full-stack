const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const blockModel =  require("../models/block.model")
const roleAuth = require("../middleware/roleAuth.middleware")
const auth = require("../middleware/auth.middleware")
const userRouter = express.Router();

userRouter.get("/users" , auth ,  roleAuth(["admin"]) , async (req, res)=>{
  try{
    const users = await userModel.find().select("-password");
    res.json(users);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}  )

userRouter.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    if(role === "admin"){
      const adminExist = await userModel.find({role : "admin"})
      if(adminExist){
        return res.status(400).json({message: "Admin already exist"})
      }
    }
    
    const hashed = await bcrypt.hash(password, 5);
    const user = new userModel({ username, password: hashed, role });
    await user.save();
    res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error Occured While Registering New User ",
        error: error.message,
      });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send({ message: "User Not Found " });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid Password " });
    }
    const token = jwt.sign({ id : user._id ,  username, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).send({ message: "User Logged In Successfully", token });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Occured While Login", error: error.message });
  }
});

userRouter.post("/logout" ,auth , roleAuth(["user" , "admin"]) , async (req,res)=>{
  try{
    const token = req.headers.authorization.split(" ")[1]
    const block = new blockModel({token})
    await block.save()
    res.status(200).send({message : "User Logged Out Successfully"})
  }catch(error){
    res.status(500).send({message : "Error Occured While Logout" , error : error.message})
  }
} )

userRouter.patch("/update/:id" ,auth ,  roleAuth(["admin"]) , async (req, res)=>{
  try{
    const id = req.params.id
    const payload  = req.body
    const user = await userModel.findByIdAndUpdate(id , payload , {new : true})
    if(!user){
      return res.status(404).send({message : "User Not Found "})
      }
      res.status(200).send({message : "User Updated Successfully" , user})
  } catch(error){
    res.status(500).send({message : "Error Occured While Updating User" , error: error.message})
  }
})

userRouter.delete("/delete/:id" ,auth, roleAuth(["admin"]) , async (req,res)=>{
  try{
    const id = req.params.id
    const deleted = await userModel.findByIdAndDelete(id)
    res.status(200).send({message : "User Deleted Successfully"  , deleted})
  }catch(error){
    res.status(500).send({message : "Error Occured While Deleting User" , error})
  }
})

module.exports = userRouter;
