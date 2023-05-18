import userModel from "../User/user.model.js";
import apiError from '../../Utils/apiError.js';
import productModel from "../Product/product.model.js";







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};






// Get All Products Of WishList

export const getAllProductsOfWishList = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user.id }).populate("WishList");

    if (user) {

        res.status(200).json({ message: "Success", data: user.WishList });

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});




// Add Product To WishList

export const addProductToWishList = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user.id });

    if (user) {


        const product = await productModel.findOne({ _id: req.params.id });
        const WishList = user.WishList;


        if (product) {


            if (WishList.includes(product._id)) {

                return next(new apiError(`This Is Product: ${product._id} Is Already In WishList`, 400));

            } else {

                WishList.push(product._id);
                await user.save();
                res.status(200).json({ message: "Success Add Product To WishList", data: WishList });

            };


        } else {

            return next(new apiError(`Not Found Product`, 400));

        };


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Delete Product From WishList

export const deleteProductFromWishList = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user.id });

    if (user) {


        const product = await productModel.findOne({ _id: req.params.id });
        const WishList = user.WishList;

        if (product) {


            if (WishList.includes(product._id)) {


                const productWillRemove = WishList.find(item => item == product.id);
                const indexOfProduct = WishList.indexOf(productWillRemove);

                WishList.splice(indexOfProduct, 1);

                await user.save();
                res.status(200).json({ message: "Success Delete Product From WishList", data: WishList });

            } else {

                return next(new apiError(`This Is Product: ${product._id} Is Not Found In WishList`, 400));

            };


        } else {

            return next(new apiError(`Not Found Product`, 400));

        };


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});