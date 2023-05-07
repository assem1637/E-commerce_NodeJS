import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser } from './user.service.js';
import {

    signup, signin, confirmEmail,
    forgetPassword, confirmResetCode, Change_Password_After_Success_Confirm_Reset_Code,
    updateProfileImage, changePassword,
    Authentication, Authorization

} from './user.auth.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';




const router = Router();



router.route("/")
    .get(Authentication, Authorization(["admin"]), getAllUsers)
    .post(Authentication, Authorization(["admin"]), uploadSingleImage("profileImage"), createNewUser);


router.route("/:id")
    .get(Authentication, Authorization(["admin"]), getSpecificUser)
    .put(Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImage"), updateSpecificUser)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificUser);



router.patch("/changeProfileImage", Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImage"), updateProfileImage);
router.patch("/changePassword", Authentication, Authorization(["admin", "user"]), changePassword);



router.post("/signup", uploadSingleImage("profileImage"), signup);
router.post("/signin", signin);
router.get("/confirmEmail/:token", confirmEmail);



router.post("/forgetPassword", forgetPassword);
router.post("/confirmResetCode/:token", confirmResetCode);
router.put("/changePasswordAfterSuccessConfirmResetCode/:token", Change_Password_After_Success_Confirm_Reset_Code);




export default router;