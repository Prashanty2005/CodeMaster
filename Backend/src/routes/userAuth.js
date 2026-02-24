const express=require("express");
const authRouter= express.Router();
const {register,login,logout,adminRegister,deleteProfile}= require("../controllers/userAuthenticate");
const userMiddleware= require("../middleware/userMiddleware");
const adminMiddleware=require("../middleware/adminMiddleware")

//register
authRouter.post('/register',register); // register ,login are controllers we will create them in controller
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
//admin middlware will verify if it is admin or not
authRouter.post("/admin/register",adminMiddleware,adminRegister); // admin will register new member as admin, so admin access is must for registration of new member
// authRouter.get('getProfile',getProfile);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);

//whenever we visit a website it first automatically checks whether we are authenticated or not
//if authenticated then direct login from using token from browser
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        lastName:req.result.lastName,
        email:req.result.email,
        _id:req.result._id,
        role:req.result.role,
        problemSolved:req.result.problemSolved
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})
// In your user routes
authRouter.put('/update', userMiddleware, async (req, res) => {
  const User = require('../models/user');   // dynamic require
  try {
    const { firstName, lastName, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.result._id,
      { firstName, lastName, age },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = authRouter;

