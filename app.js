process.on("uncaughtException", (err) => {

    console.log("uncaughtException", err);

});



import dotenv from 'dotenv';
dotenv.config({ path: "./config/.env" });



import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import morgan from 'morgan';
import apiError from './src/Utils/apiError.js';
import categoryRouter from './src/Components/Category/category.route.js';
import subCategoryRouter from './src/Components/subCategory/subCategory.route.js';
import brandRouter from './src/Components/Brand/brand.route.js';
import productRouter from './src/Components/Product/product.route.js';
import userRouter from './src/Components/User/user.route.js';
import couponRouter from './src/Components/Coupon/coupon.route.js';
import wishlistRouter from './src/Components/WishList/wishlist.route.js';
import addressRouter from './src/Components/Address/address.route.js';
import cartRouter from './src/Components/Cart/cart.route.js';
import orderRouter from './src/Components/Order/order.route.js';
import { Handle_Webhook_Checkout } from './src/Components/Order/order.service.js';
import reviewRouter from './src/Components/Review/review.route.js';



const app = express();
const port = process.env.PORT || 3000;


dbConnection();


app.post("/webhook-checkout", express.raw({ type: 'application/json' }), Handle_Webhook_Checkout);


app.use(express.json());



if (process.env.MODE_NOW === "Development") {

    app.use(morgan("dev"));

};



app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/review", reviewRouter);



app.all("*", (req, res, next) => {

    return next(new apiError(`This Is Route: ${req.originalUrl} Is Not Found In The Server`, 404));

});



app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 404;

    if (process.env.MODE_NOW === "Development") {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err, stack: err.stack });

    } else {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err });

    };

});



app.listen(port, () => {

    console.log("Server Is Running ...");

});



process.on("unhandledRejection", (err) => {

    console.log("unhandledRejection", err);

});