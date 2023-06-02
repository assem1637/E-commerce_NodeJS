import reviewModel from "./review.model.js";
import userModel from "../User/user.model.js";
import orderModel from "../Order/order.model.js";
import productModel from "../Product/product.model.js";
import apiError from "../../Utils/apiError.js";







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};









// Get All Reviews For All Users By Admin

export const getAllReviews = ErrorHandler(async (req, res, next) => {

    const allReviews = await reviewModel.find({});
    res.status(200).json({ message: "Success", data: allReviews });

});










// Get All Reviews For Specific User

export const getAllReviewsOfUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const reviews_for_specific_user = await reviewModel.find({ userId: user._id });

        if (reviews_for_specific_user > 0) {


            res.status(200).json({ message: "Success", data: reviews_for_specific_user });


        } else {

            res.status(400).json({ message: "Not Found Any Review" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});










// Create New Review By User (The User Should Be Bought The Product Before Review)


export const createReview = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myOrder = await orderModel.findOne({ userId: user._id });

        if (myOrder) {


            const cartItems = myOrder.cartItems;
            const product = await productModel.findOne({ _id: req.body.productId });

            if (!product) {

                return next(new apiError(`This Is Product: ${req.body.productId} Is Not Found`, 400));

            };


            const product_will_review = cartItems.find((item) => item.product == product._id);

            if (!product_will_review) {

                return next(new apiError(`You Should Be Buy This Product: ${product._id} To Make Review It`, 400));

            };


            req.body.userId = user._id;

            const newReview = reviewModel(req.body);
            await newReview.save();


            res.status(200).json({ message: "Success Make Review", data: newReview });


        } else {

            res.status(400).json({ message: "You Have Not Bought Any Product, Still Now" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});