import { Router } from 'express';
import { getAddressesForUser, addNewAddress, getSpecificAddress, updateSpecificAddress, deleteSpecificAddress } from './address.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';




const router = Router();



router.route("/")
    .get(Authentication, Authorization(["user", "admin"]), getAddressesForUser)
    .post(Authentication, Authorization(["user", "admin"]), addNewAddress);



router.route("/:id")
    .get(Authentication, Authorization(["user", "admin"]), getSpecificAddress)
    .put(Authentication, Authorization(["user", "admin"]), updateSpecificAddress)
    .delete(Authentication, Authorization(["user", "admin"]), deleteSpecificAddress);



export default router;