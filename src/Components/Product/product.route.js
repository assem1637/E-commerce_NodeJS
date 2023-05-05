import { Router } from "express";
import { getAllProducts, createNewProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from "../../Utils/uploadImage.js";
import { Authentication, Authorization } from '../User/user.auth.js';





const Fields = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 6 }];



const router = Router();



router.route("/")
    .get(getAllProducts)
    .post(Authentication, Authorization(["admin"]), uploadFieldsImage(Fields), createNewProduct);




router.route("/:id")
    .get(getSpecificProduct)
    .put(Authentication, Authorization(["admin"]), uploadFieldsImage(Fields), updateSpecificProduct)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificProduct);




export default router;