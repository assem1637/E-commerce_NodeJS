import { Router } from 'express';
import { getAllBrands, createNewBrand, getSpecificBrand, updateSpecificBrand, deleteSpecificBrand } from './brand.service.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';
import { Authentication, Authorization } from '../User/user.auth.js';






const router = Router();



router.route("/")
    .get(getAllBrands)
    .post(Authentication, Authorization(["admin"]), uploadSingleImage("image"), createNewBrand);



router.route("/:id")
    .get(getSpecificBrand)
    .put(Authentication, Authorization(["admin"]), uploadSingleImage("image"), updateSpecificBrand)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificBrand);



export default router;