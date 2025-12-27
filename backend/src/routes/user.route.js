import { Router } from "express";
import { addAddress, addToWishlist, deleteAddress, deleteFromWishlist, getAddresses, getWishlist, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute);

//address routes
router.post('/address', addAddress);
router.get('/address',getAddresses);
router.put('/address/:addressId',updateAddress);
router.delete('/address/:addressId',deleteAddress);

//wishlist routes
router.post('/wishlist',addToWishlist);
router.delete('/wishlist/:productId',deleteFromWishlist);
router.get('/wishlist',getWishlist)

export default router;