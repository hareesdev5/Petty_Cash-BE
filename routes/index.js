// import express from "express"
const express = require("express");
const router = express.Router();

// import userRouter from './User.js'
const userRouter = require("./User.js");
const dataRouter = require("./Data.js");

router.use("/user", userRouter);
router.use("/data", dataRouter);

// export default router;
module.exports = router;
