const express = require("express");
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require("cookie-parser");
const redisMain = require("./config/redis");
const cors = require("cors");

const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemCreater");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChat");
const videoRouter = require("./routes/videoCreator");

// 1. ALWAYS PUT CORS FIRST
app.use(cors({
    origin: [
        "http://localhost:5173",                          // Local React
        "https://code-master-frontend.vercel.app",        // Your Vercel Frontend (Check if this is the exact URL!)
        "https://code-master-seven.vercel.app"            // Just in case frontend makes requests to same domain
    ],
    credentials: true
}));

// 2. Parsers
app.use(express.json());
app.use(cookieParser());

// 3. Connect DB & Redis BEFORE defining routes (Crucial for Vercel)
// We use an async IIFE (Immediately Invoked Function Expression) to ensure 
// the serverless function initiates these immediately, but Mongoose will handle caching.
(async () => {
    try {
        await main();
        console.log("MongoDB Connection Initiated");
    } catch (err) {
        console.error("MongoDB Init Error:", err);
    }

    try {
        // If Redis fails, we don't want it to crash the whole app on Vercel
        await redisMain.connect();
        console.log("Redis Connection Initiated");
    } catch (err) {
        console.error("Redis Init Error:", err);
    }
})();

// 4. HEALTH CHECK ROUTE (Use this to test if Vercel is working!)
app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "CodeMaster API is running perfectly on Vercel!" 
    });
});

// 5. Routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

// 6. Start server (Local) or Export (Vercel)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT} (Local Mode)`);
    });
}

module.exports = app;