import { Router } from 'express';
import { getAllCarts, deleteMyCart, getCartOfUser, addProductToCart, deleteProductFromCart, updateQuantityOfProduct, applyCoupon, deleteCoupon } from './cart.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';





const router = Router();




router.get("/allCarts", getAllCarts);
router.delete("/deleteMyCart", Authentication, Authorization(["user"]), deleteMyCart);


router.route("/")
    .get(Authentication, Authorization(["user", "admin"]), getCartOfUser)
    .post(Authentication, Authorization(["user"]), addProductToCart)
    .delete(Authentication, Authorization(["user"]), deleteProductFromCart)
    .patch(Authentication, Authorization(["user"]), updateQuantityOfProduct);



router.post("/applyCoupon", Authentication, Authorization(["user"]), applyCoupon);
router.delete("/deleteCoupon", Authentication, Authorization(["user"]), deleteCoupon);





export default router;