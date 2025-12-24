import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;
      if (!clerkId) return res.status(401).json({ message: "UnAuthorized" });

      const user = await User.findOne({ clerkId: clerkId });

      if (!user) return res.status(401).json({ message: "UnAuthorized" });
      
      //bind user to use in adminOnly.
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in ProtectRouteMiddleware", error);
      res.status(500).json({ message: "Internal Error at protectRoute" });
    }
  },
];

export const adminOnly = (req,res,next)=>{

    if(!req.user){
        res.status(401).json({ message: "User Not Found" });
    }

    if(req.user.email != ENV.ADMIN_EMAIL){
        res.status(403).json({ message: "Forbidden Admin Access Only" });
    }

    next();
}



