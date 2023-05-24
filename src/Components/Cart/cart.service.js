import cartModel from './cart.model.js';
import userModel from '../User/user.model.js';
import apiError from '../../Utils/apiError.js';
import couponModel from '../Coupon/coupon.model.js';
import productModel from '../Product/product.model.js';






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





// Delete All Products From My Cart (Delete My Cart)

export const deleteMyCart = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {


            if (myCart.couponName) {

                const coupon = await couponModel.findOne({ code: myCart.couponName });

                if (coupon) {


                    const Index_Of_Cart = coupon.userUsed.indexOf(myCart.userId);
                    coupon.userUsed.splice(Index_Of_Cart, 1);
                    coupon.numberOfAvailable++;

                    await coupon.save();

                };

            };


            await cartModel.findOneAndDelete({ userId: user._id });

            res.status(200).json({ message: "Success Deleted", data: myCart });

        } else {

            res.status(400).json({ message: "Your Cart Is Empty" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

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







// Delete Specific Product From Cart

export const deleteProductFromCart = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            let cartItems = myCart.cartItems;
            const product = await productModel.findOne({ _id: req.body.productId });

            if (!product) {

                return next(new apiError(`This Is Product: ${req.body.productId} Is Not Found`, 400));

            };


            const isProduct = cartItems.find((item) => item.product == product.id);

            if (!isProduct) {

                return next(new apiError(`This Is Product: ${product._id} Not Found In My Cart`, 400));

            };

            const indexOfProduct = cartItems.indexOf(isProduct);

            cartItems.splice(indexOfProduct, 1);

            await myCart.save();


            if (cartItems.length > 0) {

                res.status(200).json({ message: "Success Deleted", data: myCart });

            } else {

                await cartModel.findOneAndDelete({ _id: myCart._id });
                res.status(400).json({ message: "Your Cart Is Empty" });

            };


        } else {

            res.status(400).json({ message: "Your Cart Is Empty" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Update Quantity Of Specific Product

export const updateQuantityOfProduct = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            let cartItems = myCart.cartItems;
            const product = await productModel.findOne({ _id: req.body.productId });

            if (!product) {

                return next(new apiError(`This Is Product: ${req.body.productId} Is Not Found`, 400));

            };


            const isProduct = cartItems.find((item) => item.product == product.id);

            if (!isProduct) {

                return next(new apiError(`This Is Product: ${product._id} Not Found In My Cart`, 400));

            };

            isProduct.quantity = Number((req.body.quantity)) > 0 ? Number((req.body.quantity)) : 1;

            await myCart.save();

            res.status(200).json({ message: "Success Updated", data: myCart });

        } else {

            res.status(400).json({ message: "Your Cart Is Empty" });

        };

    } else {

        res.status(400).json({ message: "Not Found User" });

    };

});








// Apply Coupon In My Cart

export const applyCoupon = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            const coupon = await couponModel.findOne({ code: req.body.coupon });

            if (!coupon) {

                return next(new apiError(`Oops! Coupon Code Invalid`, 400));

            };


            if (coupon.userUsed.includes(myCart.userId)) {

                return next(new apiError(`This Coupon: ${coupon.code} Has Already Been Used For This Account`, 400));

            };



            if (myCart.discount > 0) {

                return next(new apiError(`This Account Is Already Using An Activated Coupon`, 400));

            };


            myCart.discount = coupon.discount;
            myCart.totalPriceAfterDiscount = Number(myCart.totalPrice) - Number(myCart.discount);
            myCart.couponName = coupon.code;

            await myCart.save();

            coupon.numberOfAvailable--;
            coupon.userUsed.push(myCart.userId);

            await coupon.save();


            res.status(200).json({ message: "Hurray! You Got A Discount!", data: myCart });


        } else {

            res.status(400).json({ message: "Your Cart Is Empty" });

        };

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});








// Delete Coupon From My Cart

export const deleteCoupon = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });

    if (user) {

        const myCart = await cartModel.findOne({ userId: user._id });

        if (myCart) {

            const coupon = await couponModel.findOne({ code: myCart.couponName });

            if (!coupon) {

                return next(new apiError(`Not Found Coupon`, 400));

            };

            myCart.discount = 0;
            myCart.totalPriceAfterDiscount = Number(myCart.totalPrice) - Number(myCart.discount);
            myCart.couponName = undefined;

            await myCart.save();



            const Index_Of_Cart = coupon.userUsed.indexOf(myCart.userId);
            coupon.userUsed.splice(Index_Of_Cart, 1);
            coupon.numberOfAvailable++;

            await coupon.save();


            res.status(200).json({ message: "Success Deleted Coupon", data: myCart });


        } else {

            res.status(400).json({ message: "Your Cart Is Empty" });

        };

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});