import { Router } from 'express';
import { getAllProducts, createNewProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from '../../Utils/uploadImage.js';


const fields = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 6 }];


const router = Router();


router.route("/")
    .get(getAllProducts)
    .post(uploadFieldsImage(fields), createNewProduct);



router.route("/:id")
    .get(getSpecificProduct)
    .put(uploadFieldsImage(fields), updateSpecificProduct)
    .delete(deleteSpecificProduct);



export default router;