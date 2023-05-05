import { Router } from 'express';
import { getAllSubCategories, createNewSubCategory, getSpecificSubCategory, updateSpecificSubCategory, deleteSpecificSubCategory } from './subCategory.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';






const router = Router();



router.route("/")
    .get(getAllSubCategories)
    .post(Authentication, Authorization(["admin"]), createNewSubCategory);



router.route("/:id")
    .get(getSpecificSubCategory)
    .put(Authentication, Authorization(["admin"]), updateSpecificSubCategory)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificSubCategory);




export default router;