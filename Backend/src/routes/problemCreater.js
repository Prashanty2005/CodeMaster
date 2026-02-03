const express=require("express");
const problemRouter= express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware= require("../middleware/userMiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,fetchAllProblem,solvedProblemByUser,submittedProblem,chatAi}= require("../controllers/userProblem");
//requires admin 
problemRouter.post("/create",adminMiddleware,createProblem)//create probelm,only admin can do this
problemRouter.put("/update/:id",adminMiddleware,updateProblem);//update
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);//delete


//fetch
problemRouter.get("/problemById/:id",userMiddleware,getProblemById)
problemRouter.get("/getAllProblem",userMiddleware,fetchAllProblem)
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedProblemByUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);
module.exports = problemRouter;
