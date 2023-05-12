import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser } from './user.service.js';
import {

    signup, signin, confirmEmail,
    forgetPassword, confirmResetCode, Change_Password_After_Success_Confirm_Reset_Code,
    UpdateInfo, updateProfileImage, changePassword,
    Authentication, Authorization

} from './user.auth.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';




const router = Router();



router.post("/signup", uploadSingleImage("profileImage"), signup);
router.post("/signin", signin);
router.get("/confirmEmail/:token", confirmEmail);


router.put("/updateInfo", Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImage"), UpdateInfo);
router.patch("/changeProfileImage", Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImage"), updateProfileImage);
router.patch("/changePassword", Authentication, Authorization(["admin", "user"]), changePassword);


router.post("/forgetPassword", forgetPassword);
router.post("/confirmResetCode/:token", confirmResetCode);
router.put("/changePasswordAfterSuccessConfirmResetCode/:token", Change_Password_After_Success_Confirm_Reset_Code);






router.route("/")
    .get(getAllUsers)
    .post(Authentication, Authorization(["admin"]), uploadSingleImage("profileImage"), createNewUser);




router.route("/:id")
    .get(Authentication, Authorization(["admin"]), getSpecificUser)
    .put(Authentication, Authorization(["admin"]), uploadSingleImage("profileImage"), updateSpecificUser)
    .delete(Authentication, Authorization(["admin"]), deleteSpecificUser);



export default router;






// Resend verification code (OTP)