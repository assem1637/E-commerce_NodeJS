import { Router } from 'express';
import { getAllCoupons, createNewCoupon, getSpecificCoupon, updateSpecificCoupon, deleteSpecificCoupon } from './coupon.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';




const router = Router();



router.route("/")
    .get(getAllCoupons)
    .post(Authentication, Authorization(["admin"]), createNewCoupon);



router.route("/:id")
    .get(Authentication, Authorization(["admin"]), getSpecificCoupon)
    .put(Authentication, Authorization(["admin"]), updateSpecificCoupon)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificCoupon);



export default router;