import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser } from './user.service.js';
import { signup, signin, confirmEmail, forgetPassword, confirmResetCode, changePasswordAfterSuccessConfirmResetCode } from './user.auth.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';





const router = Router();



router.route("/")
    .get(getAllUsers)
    .post(uploadSingleImage("profileImage"), createNewUser);


router.route("/:id")
    .get(getSpecificUser)
    .put(uploadSingleImage("profileImage"), updateSpecificUser)
    .delete(deleteSpecificUser);




router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/confirmEmail", confirmEmail);



router.post("/forgetPassword", forgetPassword);
router.post("/confirmResetCode", confirmResetCode);
router.put("/changePasswordAfterSuccessConfirmResetCode", changePasswordAfterSuccessConfirmResetCode);




export default router;