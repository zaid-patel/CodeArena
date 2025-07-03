import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";

export function authMiddleware (req, res, next) {
    const token = req.headers.authorization;
    // console.log("token:"+token);
    
    try {
        const payload = jwt.verify(token, JWT_PASSWORD);
        
        req.id = payload.id
        next();
        return;
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
    
}