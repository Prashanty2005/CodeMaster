const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const aiRouter = express.Router();
const solveDoubt = require("../controllers/solveDoubt");
const getAiHint = require("../controllers/aiHint");

aiRouter.post('/chat', userMiddleware, solveDoubt);
aiRouter.post('/hint', userMiddleware, getAiHint);

module.exports = aiRouter;