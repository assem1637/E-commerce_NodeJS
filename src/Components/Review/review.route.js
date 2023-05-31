import { Router } from 'express';
import { getAllReviews, getAllReviewsOfUser, createReview, getSpecificReview, updateSpecificReview, deleteSpecificReview } from './review.service.js';
import { Authentication, Authorization } from '../User/user.auth.js';




const router = Router();




router.get("/allReviews", Authentication, Authorization(["admin"]), getAllReviews);


router.route("/")
    .get(Authentication, Authorization(["user"]), getAllReviewsOfUser)
    .post(Authentication, Authorization(["user"]), createReview);



router.route("/:id")
    .get(Authentication, Authorization(["user"]), getSpecificReview)
    .put(Authentication, Authorization(["user"]), updateSpecificReview)
    .delete(Authentication, Authorization(["user"]), deleteSpecificReview);




export default router;