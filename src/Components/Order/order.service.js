import orderModel from "./order.model.js";
import cartModel from '../Cart/cart.model.js';
import userModel from "../User/user.model.js";
import addressModel from "../Address/address.model.js";
import productModel from "../Product/product.model.js";
import apiError from "../../Utils/apiError.js";
import Stripe from "stripe";





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

        } else {

            return next(new apiError("Please Add New Address", 400));

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


        res.status(200).json({ message: "Success Create Order", data: newOrder });


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








// Create Checkout Session

const stripe = Stripe("sk_test_51NDVxiBNf6QU0ECaMzYorrMxWnfhQ5vRTGMb3WZiYcSM8IzAB8XMwOOtsikU17gXcMT0CYNHbZWR22jt2ADZuznh00czUPQxjw");

export const Create_Checkout_Session = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (!myCart) {

            return next(new apiError("Your Cart Is Empty", 400));

        };


        const cartItems = myCart.cartItems;

        const product = await productModel.findOne({ _id: cartItems[0].product });

        if (!product) {

            return next(new apiError("Not Found Product", 400));

        };


        const addressesOfUser = await addressModel.find({ userId: user._id });

        if (!addressesOfUser) {

            return next(new apiError("Please Add New Address", 400));

        };

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: myCart.totalPriceAfterDiscount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {

                cartId: myCart._id,

            },
            customer_email: user.email,
            success_url: `${req.protocol}://${req.headers.host}/home`,
            cancel_url: `${req.protocol}://${req.headers.host}/order`,
            expires_at: Math.floor(Date.now() / 1000) + (3600 * 2), // Configured to expire after 2 hours
        });


        res.status(200).json({ message: "Success Create Checkout Session", data: session });


    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Create Order And Pay With Payment Cash

const createOrderAfterPay = async (customer_email) => {

    const user = await userModel.findOne({ email: customer_email });
    const myCart = await cartModel.findOne({ userId: user._id });
    const cartItems = myCart.cartItems;
    const addressesOfUser = await addressModel.find({ userId: user._id });
    const lastAddress = addressesOfUser[addressesOfUser.length - 1];

    const newOrder = new orderModel({

        userId: myCart.userId,
        cartItems: myCart.cartItems,
        totalPrice: myCart.totalPriceAfterDiscount,
        taxPrice: 0,
        shippingPrice: 0,
        finalTotalPrice: myCart.totalPriceAfterDiscount,
        paymentMethods: "visa",
        isPayed: true,
        payedAt: Date.now(),
        shippingAddress: {

            name: lastAddress.name,
            address: lastAddress.address,
            phone: lastAddress.phone,
            location: lastAddress.location,

        },

    });

    await newOrder.save();


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

};







// Handle Webhook Checkout

export const Handle_Webhook_Checkout = ErrorHandler(async (req, res, next) => {

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, "whsec_3mWZU4fdeabsabXIWXEEDFGeE8pJ7wgI");
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    };


    if (event.type === "checkout.session.completed") {

        createOrderAfterPay(event.data.object.customer_email);

    };


    res.status(200).json({ message: "Success Payment With Visa" });

});