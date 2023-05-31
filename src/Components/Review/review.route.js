import { Router } from 'express';
import { getAllReviews, getAllReviewsOfUser, createReview, getSpecificReview, updateSpecificReview, deleteSpecificReview } from './review.service.js';





const router = Router();




router.get("/allReviews", getAllReviews);


router.route("/")
    .get(getAllReviewsOfUser)
    .post(createReview);



router.route("/:id")
    .get(getSpecificReview)
    .put(updateSpecificReview)
    .delete(deleteSpecificReview);




export default router;