import { Router } from 'express';
import { getAllCategories, createNewCategory, getSpecificCategory, updateSpecificCategory, deleteSpecificCategory } from "./category.service.js";
import { uploadSingleImage } from "../../Utils/uploadImage.js";



const router = Router();



router.route("/")
    .get(getAllCategories)
    .post(uploadSingleImage("image"), createNewCategory);



router.route("/:id")
    .get(getSpecificCategory)
    .put(uploadSingleImage("image"), updateSpecificCategory)
    .delete(deleteSpecificCategory);




export default router;