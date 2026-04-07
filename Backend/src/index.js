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
        "https://codemaster-platform.vercel.app",         // Your Vercel Frontend 
        "https://code-master-seven.vercel.app"            // Backend
    ],
    credentials: true
}));

// 2. Parsers
app.use(express.json());
app.use(cookieParser());

// 3. Connect DB & Redis BEFORE defining routes (Vercel Serverless Fix)
app.use(async (req, res, next) => {
    try {
        // Connect to MongoDB before proceeding
        await main(); 
        
        try {
            // Safely attempt Redis connection (if not already open)
            if (!redisMain.isOpen) {
                await redisMain.connect();
            }
        } catch (redisErr) {
            // Catch Redis errors silently so it doesn't crash the whole app
            console.error("Redis Init Error:", redisErr);
        }
        
        // Crucial: Moves on to your routes only AFTER DB is connected
        next(); 
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

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