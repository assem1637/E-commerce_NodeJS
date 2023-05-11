import userModel from './user.model.js';
import apiError from '../../Utils/apiError.js';
import cloudinary from "cloudinary";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMessageToConfirmEmail from '../../Utils/sendConfirmEmail.js';





// Configuration 
cloudinary.config({
    cloud_name: "drfegeke8",
    api_key: "119752893581328",
    api_secret: "BULOuHNhe80eEp4GP9kvph02pdk"
});






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};








// Get All Users By Admin

export const getAllUsers = ErrorHandler(async (req, res, next) => {

    const allUsers = await userModel.find({});
    res.status(200).json({ message: "Success", data: allUsers });

});






// Create New User By Admin

export const createNewUser = ErrorHandler(async (req, res, next) => {


    const user = await userModel.findOne({ email: req.body.email });


    if (user) {

        return next(new apiError(`This Is Email: ${user.email} Is Already Used`, 400));

    } else {



        if (req.body.password === req.body.rePassword) {

            const hash = bcrypt.hashSync(req.body.password, 5);

            req.body.password = hash;
            req.body.rePassword = hash;


            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                req.body.profileImage = cloud.secure_url;

            };



            const newUser = userModel(req.body);
            await newUser.save();
            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
            sendMessageToConfirmEmail(req.body.email, token, req.protocol, req.headers.host);


            res.status(200).json({ message: "Success", data: newUser });


        } else {

            return next(new apiError("Password And rePassword Are Doesn't Match", 400));

        };

    };

});







// Get Specific User By Id For Admin Only

export const getSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.params.id });

    if (user) {

        res.status(200).json({ message: "Success", data: user });

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});







// Update Specific User By Id For Admin Only

export const updateSpecificUser = ErrorHandler(async (req, res, next) => {

    let user = await userModel.findOne({ _id: req.params.id });

    if (user) {


        if (req.body.password) {

            if (req.body.password !== req.body.rePassword) {

                return next(new apiError("Password And rePassword Are Doesn't Match", 400));

            };


            const hash = bcrypt.hashSync(req.body.password, 5);

            req.body.password = hash;
            req.body.rePassword = hash;


            req.body.changePasswordAt = Date.now();

        };


        if (req.body.phone) {

            if (!req.body.phone.match(/^01(0|1|2|5)[0-9]{8}$/)) {

                return next(new apiError(`It's Must Be A Egyption Phone Valid`, 400));

            };

        };


        if (req.body.email) {

            let searchUser = await userModel.findOne({ email: req.body.email });

            if (searchUser) {

                return next(new apiError(`This Is Email: ${searchUser.email} Is Already Used`, 400));

            } else {

                user.emailConfirm = false;
                const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
                sendMessageToConfirmEmail(req.body.email, token, req.protocol, req.headers.host);

                await user.save();

            };

        };


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.profileImage = cloud.secure_url;

        };

        user = await userModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });


        res.status(200).json({ message: "Success Updated", data: user });


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});






// Delete Specific User By Id For Admin Only

export const deleteSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOneAndDelete({ _id: req.params.id });

    if (user) {

        res.status(200).json({ message: "Success Deleted", data: user });

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});