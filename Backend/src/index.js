const express=require("express");
const app= express();
require('dotenv').config();
const main=require('./config/db')
const cookieParser= require("cookie-parser");
const redisMain= require("./config/redis");
const authRouter=require("./routes/userAuth")
const problemRouter= require("./routes/problemCreater");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChat");
const videoRouter = require("./routes/videoCreator")
const cors = require("cors")

// ... imports remain the same ...

app.use(express.json());
app.use(cookieParser());

// CHANGE 1: Update CORS to allow both Localhost and your Vercel Frontend
app.use(cors({
    origin: [
        "http://localhost:5173",                          // For local testing
        "https://code-master-frontend.vercel.app"         // YOUR VERCEL FRONTEND URL
    ],
    credentials: true
}));

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// CHANGE 2: Separate DB connection from Server Listening
// We connect to DB immediately so Vercel has it ready
main().then(() => console.log("Connected to DB")).catch(err => console.log(err));
redisMain.connect().then(() => console.log("Connected to Redis")).catch(err => console.log(err));

// CHANGE 3: Only listen on Port 3000 if we are NOT on Vercel
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Listening on port 3000 (Local Mode)");
    });
}

// CHANGE 4: Export the app for Vercel
module.exports = app;