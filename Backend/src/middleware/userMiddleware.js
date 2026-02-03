const jwt= require("jsonwebtoken");
const User= require("../models/user");
const redisClient= require("../config/redis");

const userMiddleware= async(req,res,next)=>{
    try{
        const {token}= req.cookies;
        if(!token)
            throw new Error("invalid user");

        const payload=  jwt.verify(token,process.env.JWT_KEY);
        const {email}= payload;
        if(!email)
            throw new Error ("invalid token");
        const result=await  User.findOne({email});
        if(!result)
            throw new Error("user does not exist");

        const isBlocked= await redisClient.exists(`token:${token}`);
        if(isBlocked)
            throw new Error("invalid token");
        
        req.result= result;
        next();
    }   
    catch(err){
        res.send("err:"+err.message);
    }
}

module.exports= userMiddleware;