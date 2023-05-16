import couponModel from "./coupon.model.js";
import apiError from "../../Utils/apiError.js";







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};






// Get All Coupons

export const getAllCoupons = ErrorHandler(async (req, res, next) => {

    const allCoupons = await couponModel.find({});
    res.status(200).json({ message: "Success", data: allCoupons });

});





// Create New Coupon

export const createNewCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOne({ code: req.body.code });

    if (coupon) {

        return next(new apiError(`This Is Coupon: ${coupon.code} Is Already Exists`, 400));

    } else {


        req.body.expire = (Date.now() + (req.body.expire * 24 * 60 * 60 * 1000));


        const newCoupon = couponModel(req.body);
        await newCoupon.save();


        res.status(200).json({ message: "Success", data: newCoupon });


    };

});




// Get Specific Coupon

export const getSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOne({ _id: req.params.id });

    if (coupon) {

        res.status(200).json({ message: "Success", data: coupon });

    } else {

        res.status(400).json({ message: "Not Found Coupon" });

    };

});






// Update Specific Coupon

export const updateSpecificCoupon = ErrorHandler(async (req, res, next) => {

    let coupon = await couponModel.findOne({ _id: req.params.id });

    if (coupon) {


        if (req.body.expire) {

            req.body.expire = (Date.now() + (req.body.expire * 24 * 60 * 60 * 1000));

        };


        coupon = await couponModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        res.status(200).json({ message: "Success Updated", data: coupon });


    } else {

        res.status(400).json({ message: "Not Found Coupon" });

    };

});




// Delete Specific Coupon 

export const deleteSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOneAndDelete({ _id: req.params.id });

    if (coupon) {

        res.status(200).json({ message: "Success Deleted", data: coupon });

    } else {

        res.status(400).json({ message: "Not Found Coupon" });

    };

});