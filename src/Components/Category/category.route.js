import { Router } from 'express';
import { getAllCategories, createNewCategory, getSpecificCategory, updateSpecificCategory, deleteSpecificCategory } from "./category.service.js";
import { uploadSingleImage } from "../../Utils/uploadImage.js";
import { Authentication, Authorization } from '../User/user.auth.js';





const router = Router();



router.route("/")
    .get(getAllCategories)
    .post(Authentication, Authorization(["admin"]), uploadSingleImage("image"), createNewCategory);



router.route("/:id")
    .get(getSpecificCategory)
    .put(Authentication, Authorization(["admin"]), uploadSingleImage("image"), updateSpecificCategory)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificCategory);




export default router;