const User=require('../models/user')
const validate= require("../utils/validator");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const redisClient= require("../config/redis");
const Submission = require("../models/submission")

const JWT_SECRET = process.env.JWT_KEY;

const register=async(req,res)=>{
    try{
        // validate the data
        validate(req.body);
        const {firstName, email, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        // req.body.role='user';//only users will be registerd through this path
        const createdUser = await User.create(req.body);

        const foundUser= await  User.findOne({email})
        const reply={
            firstName:foundUser.firstName,
            email:foundUser.email,
            _id:foundUser._id,
            role:foundUser.role
        }
        if (!JWT_SECRET) throw new Error('JWT secret not set. Set process.env.JWT')
        const token = jwt.sign({email: email, role:createdUser.role, _id:createdUser._id}, JWT_SECRET, {expiresIn:60*60})
        res.cookie('token', token, {maxAge:60*60*1000})
        res.status(201).json({
            user:reply,
            message:"Register successfull"
        })
    }
    catch(err){
        res.status(400).send("error:"+err)
    }
}

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password )
            throw new Error("invalid Credintials");

        const foundUser = await User.findOne({email})

        if(!foundUser)
            throw new Error ("user does not exits");

        const ans = await bcrypt.compare(password, foundUser.password);
        if(!ans)
            throw new Error ("Invalid Credintials");
        
        const reply={
            firstName:foundUser.firstName,
            email:foundUser.email,
            _id:foundUser._id,
            role:foundUser.role
        }
        if (!JWT_SECRET) throw new Error('JWT secret not set. Set process.env.JWT')
        const token = jwt.sign({email:email, role:foundUser.role,id:foundUser._id}, JWT_SECRET, {expiresIn:60*60})
        res.cookie('token', token, {maxAge:60*60*1000});

        res.status(200).json({
            user:reply,
            message:"login successfull"
        })  //we will send a common user data to frontend that is required in all pages
    }
    catch(err){
        res.status(401).send("err"+err);
    }
}

const logout= async(req,res)=>{
    try{
        const {token}= req.cookies;

        const payload= jwt.decode(token);

        await redisClient.set(`token:${token}`,`blocked`);
        await redisClient.expireAt(`token:${token}`,payload.exp);


        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("logged out sccesssfully");
        //token add kar dunga ke blacklist
        //cookies ko clear 
    }
    catch(err){
        res.send("err"+ err.message);
    }
}

const adminRegister= async(req,res)=>{
     try{
        // validate the data
        validate(req.body);
        const {firstName, email, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role= 'admin';

        const createdUser = await User.create(req.body);

        if (!JWT_SECRET) throw new Error('JWT secret not set. Set process.env.JWT')
        const token = jwt.sign({email: email, role:createdUser.role, id:createdUser._id}, JWT_SECRET, {expiresIn:60*60})
        res.cookie('token', token, {maxAge:60*60*1000})
        res.status(201).send("user successfully registered");
    }
    catch(err){
        res.status(400).send("error:"+err)
    }
}

const deleteProfile = async(req,res)=>{
    try{
        const userId = req.result._id;

        await User.findByIdAndDelete(userId);

        //delelte from submission
        // await Submission.deleteMany({userId});
        //or see user Model

        res.status(200).send("deleted Successfully");
    }
    catch(err){
        res.status(500).send(err);
    }
}
module.exports={register,login,logout,adminRegister,deleteProfile};