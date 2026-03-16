const express=require("express");
const authRouter= express.Router();
const {register,login,logout,adminRegister,deleteProfile}= require("../controllers/userAuthenticate");
const userMiddleware= require("../middleware/userMiddleware");
const adminMiddleware=require("../middleware/adminMiddleware")
const Submission  = require("../models/submission")
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

authRouter.get("/activity", userMiddleware, async (req, res) => {
  try {
    const userId = req.result._id;

    // Calculate the date exactly one year ago from today
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const activityData = await Submission.aggregate([
      // 1. Match ONLY accepted submissions for this user from the past year
      {
        $match: {
        userId: userId,
        createdAt: { $gte: oneYearAgo },
        status: 'accepted' // Matches the lowercase 'accepted' in your schema
        }
      },
      // 2. Group by the date portion of createdAt (YYYY-MM-DD)
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 } // Count how many accepted submissions happened this day
        }
      },
      // 3. Format the output
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1
        }
      },
      // 4. Sort chronologically
      {
        $sort: { date: 1 }
      }
    ]);

    res.status(200).json(activityData);

  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Failed to fetch activity data" });
  }
});

module.exports = authRouter;

