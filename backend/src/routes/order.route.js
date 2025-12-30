import { Router } from "express";
import { createOrders, getOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/",createOrders);
router.get('/',getOrders);



export default router;