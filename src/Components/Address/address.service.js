import userModel from "../User/user.model.js";
import apiError from "../../Utils/apiError.js";
import addressModel from "./address.model.js";






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};






// Get All Address For User

export const getAddressesForUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const addressesForUser = await addressModel.find({ userId: user._id });

        if (addressesForUser.length > 0) {

            res.status(200).json({ message: "Success", data: addressesForUser });

        } else {

            res.status(400).json({ message: "Not Found Any Address" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});







// Add New Address For User

export const addNewAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        req.body.userId = user._id;
        const newAddress = addressModel(req.body);
        await newAddress.save();

        res.status(200).json({ message: "Success", data: newAddress });

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});






// Get Specific Address

export const getSpecificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const specificAddress = await addressModel.findOne({ _id: req.params.id, userId: user._id });

        if (specificAddress) {

            res.status(200).json({ message: "Success", data: specificAddress });

        } else {

            res.status(400).json({ message: "Not Found Address" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Update Specific Address

export const updateSpecificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        let specificAddress = await addressModel.findOne({ _id: req.params.id, userId: user._id });

        if (specificAddress) {

            req.body.userId = user._id;
            specificAddress = await addressModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            await specificAddress.save();
            res.status(200).json({ message: "Success Updated", data: specificAddress });

        } else {

            res.status(400).json({ message: "Not Found Address" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});







// Delete Specific Address

export const deleteSpecificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const specificAddress = await addressModel.findOneAndDelete({ _id: req.params.id, userId: user._id });

        if (specificAddress) {

            res.status(200).json({ message: "Success Deleted", data: specificAddress });

        } else {

            res.status(400).json({ message: "Not Found Address" });

        };

    } else {

        req.status(400).json({ message: "Not Found User" });

    };

});