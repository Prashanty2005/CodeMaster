// const jwt= require("jsonwebtoken");
// const User= require("../models/user");
// const redisClient= require("../config/redis");

// const adminMiddleware= async(req,res,next)=>{
//     try{
//         const {token}= req.cookies;
//         if(!token)
//             throw new Error("invalid user");

//         const payload=  jwt.verify(token,process.env.JWT_KEY);
//         const {email}= payload;
//         if(!email)
//             throw new Error ("invalid token");
//         const result= User.findOne({email});
//         if(!result)
//             throw new Error("user doesnt exist");

//         if(payload.role!='admin')
//             throw new Erro("invalid token");

//         const isBlocked= await redisClient.exists(`token:${token}`);
//         if(isBlocked)
//             throw new Error("invalid token");

//         req.result=result;

//         next();
//     }   
//     catch(err){
//         res.send("err:"+err.message);
//     }
// }

// module.exports= adminMiddleware;




const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token not found in cookies");
        }

        // Verify JWT token
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { email, role } = payload;
        
        if (!email) {
            throw new Error("Invalid token: no email in payload");
        }

        // Check if token is blacklisted in Redis
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Token has been invalidated");
        }

        // Check user role
        if (role !== 'admin') {
            throw new Error("Admin access required");
        }

        // FIX: Add await here!
        const result = await User.findOne({ email });
        
        if (!result) {
            throw new Error("User doesn't exist");
        }

        // Attach user to request
        req.result = result;
        next();
    } catch (err) {
        console.error("Admin middleware error:", err.message);
        res.status(401).json({ 
            error: "Authentication failed",
            message: err.message 
        });
    }
}

module.exports = adminMiddleware;