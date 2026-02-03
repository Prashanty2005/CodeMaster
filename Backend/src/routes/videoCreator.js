const express = require("express");

const adminMiddleware= require("../middleware/adminMiddleware");
const videoRouter= express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo,getVideoByProblemId}=require("../controllers/videoSection") 

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature); // to upload video from frontend we need Signature from backend , this will get that
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);// after video is uploaded on cloudanary ,all meta data is saved in database
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);//delete video by id
videoRouter.get("/getVideo/:problemId",adminMiddleware,getVideoByProblemId);

module.exports=videoRouter;