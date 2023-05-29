import { Router } from 'express';
import { getAllOrders, getOrdersOfUser, createOrderPayCash } from './order.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';





const router = Router();



router.get("/allOrders", getAllOrders);


router.route("/")
    .get(Authentication, Authorization(["user"]), getOrdersOfUser)
    .post(Authentication, Authorization(["user"]), createOrderPayCash);


// router.post("/payVisa", Authentication, Authorization(["user"]), createOrderPayVisa);


// router.put("/updatePay", Authentication, Authorization(["admin"]), updatePay);
// router.put("/updateDelivered", Authentication, Authorization(["admin"]), updateDelivered);




export default router;