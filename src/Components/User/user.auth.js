import userModel from './user.model.js';
import apiError from '../../Utils/apiError.js';
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
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








// Sign Up

export const signup = ErrorHandler(async (req, res, next) => {

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

            return next(new apiError(`Password And rePassword Are Doesn't Match`, 400));

        };

    };

});







// Sign In

export const signin = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {

        if (user.emailConfirm) {

            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {

                const token = jwt.sign({

                    id: user._id,
                    name: user.name,
                    age: user.age,
                    phone: user.phone,
                    email: user.email,
                    emailConfirm: user.emailConfirm,
                    role: user.role,
                    isActive: user.isActive,
                    profileImage: user.profileImage,

                }, process.env.SECRET_KEY_SIGNIN);


                res.status(200).json({ message: "Success", token });

            } else {

                res.status(400).json({ message: "Password Is Incorrect" });

            };

        } else {

            res.status(400).json({ message: `Confirm Your Account, Then Try Again` });

        };

    } else {

        res.status(400).json({ message: `This Is Email: ${req.body.email} Is Doesn't Exists` });

    };

});







// Confirm Account

export const confirmEmail = ErrorHandler(async (req, res, next) => {

    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY_SIGNUP, async function (err, decoded) {

        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {

            const user = await userModel.findOne({ email: decoded.email });

            if (user) {

                user.emailConfirm = true;

                await user.save();

                res.status(200).json({ message: "Your Account Is Confirmed" });

            } else {

                res.status(400).json({ message: `This Is Email: ${decoded.email} Is Doesn't Exists` });

            };

        };

    });

});