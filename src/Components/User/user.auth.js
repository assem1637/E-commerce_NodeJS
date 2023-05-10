import userModel from './user.model.js';
import apiError from '../../Utils/apiError.js';
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import sendMessageToConfirmEmail from '../../Utils/sendConfirmEmail.js';
import sendResetCode from '../../Utils/sendResetCode.js';





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

            req.body.role = "user";

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


        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {


            if (user.emailConfirm) {

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
                    changePasswordAt: user.changePasswordAt

                }, process.env.SECRET_KEY_SIGNIN);


                res.status(200).json({ message: "Success", token });

            } else {

                res.status(400).json({ message: `Confirm Your Account, Then Try Again` });

            };


        } else {

            res.status(400).json({ message: "Password Is Incorrect" });

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








// Forget Password and Send Reset Code To Email

export const forgetPassword = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {

        const ResetCode = parseInt(Math.random() * 1000000).toString();
        const hashResetCode = bcrypt.hashSync(ResetCode, 5);

        user.resetCode = hashResetCode;

        await user.save();
        sendResetCode(user.email, ResetCode);
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY_RESET_PASSWORD, { expiresIn: 15 * 60 });

        res.status(200).json({ message: "Success Send Reset Code, Check Your Email", token });

    } else {

        res.status(400).json({ message: "Not Found User, Please try again with other information." });

    };

});







// Confirm Reset Code 

export const confirmResetCode = ErrorHandler(async (req, res, next) => {

    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY_RESET_PASSWORD, async function (err, decoded) {

        if (err) {

            if (err.name == "TokenExpiredError") {

                res.status(400).json({ message: `Token Expired At ${err.expiredAt}`, err });

            } else {

                res.status(400).json({ message: "Invalid Token", err });

            };

        } else {

            const user = await userModel.findOne({ email: decoded.email });

            if (user) {

                const match = await bcrypt.compare(req.body.resetCode, user.resetCode);

                if (match) {

                    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY_CONFIRM_RESET_PASSWORD, { expiresIn: 15 * 60 });
                    res.status(200).json({ message: "Success Confirm Reset Code", token });

                } else {

                    return next(new apiError(`The Number That You've Entered Doesn't Match Your Code. Please Try Again.`, 400));

                };


            } else {

                res.status(400).json({ message: "Not Found User" });

            };

        };

    });

});








// Change_Password_After_Success_Confirm_Reset_Code

export const Change_Password_After_Success_Confirm_Reset_Code = ErrorHandler(async (req, res, next) => {

    const token = req.params.token;

    jwt.verify(token, process.env.SECRET_KEY_CONFIRM_RESET_PASSWORD, async function (err, decoded) {

        if (err) {

            if (err.name == "TokenExpiredError") {

                res.status(400).json({ message: `Token Expired At ${err.expiredAt}`, err });

            } else {

                res.status(400).json({ message: "Invalid Token", err });

            };

        } else {

            const user = await userModel.findOne({ email: decoded.email });

            if (user) {


                const match = await bcrypt.compare(req.body.newPassword, user.password);


                if (match) {


                    return next(new apiError(`The New Password Must Be Different From The Current Password.`, 400));


                } else {



                    const hash = bcrypt.hashSync(req.body.newPassword, 5);

                    user.password = hash;
                    user.rePassword = hash;
                    user.changePasswordAt = Date.now();

                    user.resetCode = undefined;

                    await user.save();

                    res.status(200).json({ message: "Success Change Password, Try Login Now" });


                };

            } else {

                res.status(400).json({ message: "Not Found User" });

            };

        };

    });

});






// Update Profile Image By User

export const updateProfileImage = ErrorHandler(async (req, res, next) => {

    if (req.file) {


        const user = await userModel.findOne({ email: req.user.email });

        if (user) {

            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                user.profileImage = cloud.secure_url;

            };


            await user.save();

            res.status(200).json({ message: "Success Change Profile Image", user });


        } else {

            res.status(400).json({ message: "Not Found User" });

        };


    } else {

        res.status(400).json({ message: `This Is Endpoint Used To Update Profile Image Only` });

    };

});





// Change Password By User

export const changePassword = ErrorHandler(async (req, res, next) => {

    if (req.body.newPassword) {

        const user = await userModel.findOne({ email: req.user.email });

        if (user) {

            if (req.body.currentPassword) {


                const match = await bcrypt.compare(req.body.currentPassword, user.password);


                if (match) {


                    if (req.body.newPassword !== req.body.reNewPassword) {

                        return next(new apiError("Password And rePassword Are Doesn't Match", 400));

                    } else {

                        const matching = await bcrypt.compare(req.body.newPassword, user.password);


                        if (matching) {


                            return next(new apiError(`The New Password Must Be Different From The Current Password.`, 400));


                        } else {

                            const hash = bcrypt.hashSync(req.body.newPassword, 5);

                            user.password = hash;
                            user.rePassword = hash;
                            user.changePasswordAt = Date.now();

                            await user.save();

                            res.status(200).json({ message: "Success Change Password", user });


                        };

                    };


                } else {

                    return next(new apiError(`Current Password Is Wrong`, 400));

                };


            } else {

                return next(new apiError(`Current Password Is Required`, 400));

            };

        } else {

            res.status(400).json({ message: "Not Found User" });

        };

    } else {

        res.status(400).json({ message: `This Is Endpoint Used To Change Password Only` });

    };

});




// Authentication 

export const Authentication = ErrorHandler(async (req, res, next) => {

    const token = req.headers["token"];

    jwt.verify(token, process.env.SECRET_KEY_SIGNIN, async function (err, decoded) {

        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {


            const user = await userModel.findOne({ email: decoded.email });


            if (user) {

                const Change_Password_At = new Date(user.changePasswordAt);
                const Final_Date = parseInt(Change_Password_At.getTime() / 1000);

                if (user.changePasswordAt) {

                    if (decoded.iat > Final_Date) {

                        req.user = user;
                        next();

                    } else {

                        const passwordChangedAt = new Date(user.changePasswordAt);
                        res.status(400).json({ message: `Your Password Changed At: ${passwordChangedAt}` });

                    };

                } else {

                    req.user = user;
                    next();

                };


            } else {

                res.status(400).json({ message: "Not Found User" });

            };

        };

    });

});









// Authorization 

export const Authorization = (roles) => {

    return ErrorHandler(async (req, res, next) => {

        const user = await userModel.findOne({ email: req.user.email });

        if (user) {

            if (roles.includes(user.role)) {

                req.user = user;
                next();

            } else {

                res.status(400).json({ message: "You Not Authorized To Do That" });

            };

        } else {

            res.status(400).json({ message: "Not Found User" });

        };

    });

};