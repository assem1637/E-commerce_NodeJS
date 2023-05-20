import { Router } from 'express';
import { getAllCarts, getCartOfUser, addProductToCart, deleteProductFromCart, updateQuantityOfProduct, applyCoupon, deleteCoupon } from './cart.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';





const router = Router();




router.get("/allCarts", Authentication, Authorization(["admin"]), getAllCarts);



router.route("/")
    .get(Authentication, Authorization(["user"]), getCartOfUser)
    .post(Authentication, Authorization(["user"]), addProductToCart)
    .delete(Authentication, Authorization(["user"]), deleteProductFromCart)
    .patch(Authentication, Authorization(["user"]), updateQuantityOfProduct);



router.post("/applyCoupon", Authentication, Authorization(["user"]), applyCoupon);
router.delete("/deleteCoupon", Authentication, Authorization(["user"]), deleteCoupon);





export default router;