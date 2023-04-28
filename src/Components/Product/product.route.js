import { Router } from "express";
import { getAllProducts, createNewProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from "../../Utils/uploadImage.js";



const Fields = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 6 }];



const router = Router();



router.route("/")
    .get(getAllProducts)
    .post(uploadFieldsImage(Fields), createNewProduct);




router.route("/:id")
    .get(getSpecificProduct)
    .put(uploadFieldsImage(Fields), updateSpecificProduct)
    .delete(deleteSpecificProduct);




export default router;