import orderModel from "./order.model.js";
import cartModel from '../Cart/cart.model.js';
import userModel from "../User/user.model.js";
import addressModel from "../Address/address.model.js";
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









// Get All Orders Of All User For Admin

export const getAllOrders = ErrorHandler(async (req, res, next) => {

    const allOrders = await orderModel.find({}).populate("userId", "name email role phone profileImage");
    res.status(200).json({ message: "Success", data: allOrders });

});







// Get All Order For Specific User

export const getOrdersOfUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const ordersOfUser = await orderModel.find({ userId: user._id });

        if (ordersOfUser.length > 0) {

            res.status(200).json({ message: "Success", data: ordersOfUser });

        } else {

            res.status(400).json({ message: "Not Found Any Order" });

        };


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Create Order And Pay With Payment Cash

export const createOrderPayCash = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });
        const cartItems = myCart.cartItems;

        if (!myCart) {

            return next(new apiError("Your Cart Is Empty", 400));

        };


        const addressesOfUser = await addressModel.find({ userId: user._id });



        if (addressesOfUser) {

            const lastAddress = addressesOfUser[addressesOfUser.length - 1];

            req.body.shippingAddress = {

                name: lastAddress.name,
                address: lastAddress.address,
                phone: lastAddress.phone,
                location: lastAddress.location,

            }

        };


        req.body.userId = myCart.userId;
        req.body.cartItems = myCart.cartItems;
        req.body.totalPrice = myCart.totalPriceAfterDiscount;
        req.body.taxPrice = 0;
        req.body.shippingPrice = 0;
        req.body.finalTotalPrice = myCart.totalPriceAfterDiscount - (req.body.taxPrice + req.body.shippingPrice);
        req.body.paymentMethods = "cash";


        const newOrder = orderModel(req.body);
        await newOrder.save();


        res.status(200).json({ message: "Success Order", data: newOrder });


        // Update Products Info
        cartItems.forEach(async (item) => {

            const product = await productModel.findOne({ _id: item.product });


            product.soldCount += 1;
            product.quantity -= item.quantity;

            if (product.quantity < 0) {

                product.quantity = 0;

            };


            await product.save();

        });


        // Delete My Cart
        await cartModel.findOneAndDelete({ userId: myCart.userId });


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});