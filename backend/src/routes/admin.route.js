import {Router} from 'express';
import { createProduct,getAllProducts, updateProducts,getOrders,updateOrderStatus, getDashboardStats, getAllCustomers } from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { adminOnly, protectRoute } from '../middlewares/auth.middleware.js'

const router = Router();

router.use(protectRoute,adminOnly);

//product routes
router.get('/products',getAllProducts);
router.post('/products',upload.array("images",3),createProduct);
router.put('/products',upload.array("images",3),updateProducts);

//orders route
router.get('/orders',getOrders);
router.patch('/orders/:orderId/status',updateOrderStatus);

//customers & stats route
router.get('/customers', getAllCustomers);
router.get('/stats',getDashboardStats);

export default router;