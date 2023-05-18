import { Router } from 'express';
import { getAllProductsOfWishList, addProductToWishList, deleteProductFromWishList } from './wishlist.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';



const router = Router();


router.route("/")
    .get(Authentication, Authorization(["user", "admin"]), getAllProductsOfWishList);


router.route("/:id")
    .post(Authentication, Authorization(["user", "admin"]), addProductToWishList)
    .delete(Authentication, Authorization(["user", "admin"]), deleteProductFromWishList);





export default router;