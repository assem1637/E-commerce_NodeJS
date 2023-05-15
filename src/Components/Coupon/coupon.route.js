import { Router } from 'express';
import { getAllCoupons, createNewCoupon, getSpecificCoupon, updateSpecificCoupon, deleteSpecificCoupon } from './coupon.service.js';





const router = Router();



router.route("/")
    .get(getAllCoupons)
    .post(createNewCoupon);



router.route("/:id")
    .get(getSpecificCoupon)
    .put(updateSpecificCoupon)
    .delete(deleteSpecificCoupon);



export default router;