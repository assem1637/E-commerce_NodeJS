import cartModel from './cart.model.js';
import userModel from '../User/user.model.js';
import productModel from '../Product/product.model.js';
import apiError from '../../Utils/apiError.js';






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};






// Function To Calculate Total Price

const calcTotalPrice = (cartItems) => {


    let totalPrice = 0;

    cartItems.forEach((item) => {

        totalPrice += (item.price) * (item.quantity);

    });


    return totalPrice;

};





// Get All Carts

export const getAllCarts = ErrorHandler(async (req, res, next) => {

    const allCarts = await cartModel.find({}).populate("userId");
    res.status(200).json({ message: "Success", data: allCarts });

});







// Get Cart Of User

export const getCartOfUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            res.status(200).json({ message: "Success", data: myCart });

        } else {

            res.status(400).json({ message: "Not Found Cart" });

        };


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Add Product To My Cart

export const addProductToCart = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            const cartItems = myCart.cartItems;
            const product = await productModel.findOne({ _id: req.body.productId });


            if (!product) {

                return next(new apiError(`This Is Product: ${req.body.productId} Is Not Found`, 400));

            };


            const isProduct = cartItems.find((item) => item.product == product.id);

            if (isProduct) {

                isProduct.quantity += Number((req.body.quantity)) > 1 ? Number((req.body.quantity)) : 1;

                myCart.totalPrice = calcTotalPrice(cartItems);

                myCart.totalPriceAfterDiscount = Number(myCart.totalPrice) - Number(myCart.discount);


                await myCart.save();

                res.status(200).json({ message: "Success Add Product To Your Cart", data: myCart });

            } else {

                cartItems.push({

                    product: product._id,
                    price: product.price,
                    quantity: Number((req.body.quantity)) > 1 ? Number((req.body.quantity)) : 1,

                });


                myCart.totalPrice = calcTotalPrice(cartItems);

                myCart.totalPriceAfterDiscount = Number(myCart.totalPrice) - Number(myCart.discount);

                await myCart.save();

                res.status(200).json({ message: "Success Add Product To Your Cart", data: myCart });

            };


        } else {


            const product = await productModel.findOne({ _id: req.body.productId });

            if (!product) {

                return next(new apiError(`This Is Product: ${req.body.productId} Is Not Found`, 400));

            };



            req.body.userId = user._id;
            req.body.cartItems = [{

                product: product._id,
                price: product.price,
                quantity: Number((req.body.quantity)) > 1 ? Number((req.body.quantity)) : 1,

            }];


            req.body.totalPrice = Number(product.price) * Number(req.body.cartItems[0].quantity);
            req.body.totalPriceAfterDiscount = Number(req.body.totalPrice);



            const newCart = cartModel(req.body);

            await newCart.save();

            res.status(200).json({ message: "Success Add Product To Your Cart", data: newCart });

        };


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});