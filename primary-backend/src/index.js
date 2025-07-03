import express from "express";
import userRouter  from "./router/userRouter.js";
import cors from "cors";
import { problemsRouter } from "./router/problemsRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import dotenv from "dotenv"
import contestRouter from "./router/contestRouter.js";
import submissionRouter from "./router/submissionRouter.js";
dotenv.config();
const app=express();
app.use(express.json())
app.use(cors());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/problems",problemsRouter);
app.use("/api/v1/contest",contestRouter);
app.use("/api/v1/submission",submissionRouter);
app.get("/health",(req,res)=>{

    console.log("came");
    
    return res.status(200).json({
        message:"health check"
    });
})

// console.log(pr);


app.listen(8000,()=>{
    console.log("server is running on port 8000");
    
});
