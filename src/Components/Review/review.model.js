import mongoose from "mongoose";






const reviewSchema = mongoose.Schema({


    comment: {

        type: String,
        required: [true, "Comment Of Review Is Required"],
        minlength: [3, "3 Is The Lowest Comment Of Review"],

    },


    productId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "products",
        required: [true, "ID Of Product Is Required To Make Review"],

    },



    userId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: [true, "ID Of User Is Required To Make Review"],

    },



    ratingAverage: {

        type: Number,
        required: [true, "Rating Of Product Is Required To Make Review"],
        min: [1, "1 Is The Lowest Rate Of Product"],
        max: [5, "5 Is The Largest Rage Of Product"],

    },


}, { timestamps: true });



const reviewModel = mongoose.model("review", reviewSchema);



export default reviewModel;