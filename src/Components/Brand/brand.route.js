import { Router } from 'express';
import { getAllBrands, createNewBrand, getSpecificBrand, updateSpecificBrand, deleteSpecificBrand } from './brand.service.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';




const router = Router();



router.route("/")
    .get(getAllBrands)
    .post(uploadSingleImage("image"), createNewBrand);



router.route("/:id")
    .get(getSpecificBrand)
    .put(uploadSingleImage("image"), updateSpecificBrand)
    .delete(deleteSpecificBrand);



export default router;