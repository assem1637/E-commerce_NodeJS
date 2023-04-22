import mongoose from "mongoose";






const productSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of Product Is Required"],
        minlength: [3, "3 Is The Lowest Name Of Product"],
        maxlength: [30, "30 Is The Largest Name Of Product"],

    },


    slug: {

        type: String,
        lowercase: true,

    },


    description: {

        type: String,
        required: [true, "Description Of Product Is Required"],

    },


    price: {

        type: Number,
        required: [true, "Price Of Product Is Required"],

    },



    priceAfterDiscount: {

        type: Number,
        required: [true, "priceAfterDiscount Of Product Is Required"],

    },



    quantity: {

        type: Number,
        required: [true, "Quantity Of Product Is Required"],

    },



    imageCover: {

        type: String,
        required: [true, "imageCover Of Product Is Required"],

    },



    image: [String],

    colors: [String],

    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "Category Of Product Is Required"],

    },


    subCategory: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "subcategory",
        required: [true, "subCategory Of Product Is Required"],

    },



    brand: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "brand",
        required: [true, "Brand Of Product Is Required"],

    },



    soldCount: {

        type: Number,
        default: 0,

    },



    ratingAverage: {

        type: Number,
        required: [true, "ratingAverage Of Product Is Required"],
        min: [1, "1 Is The Lowest Rate Of Product"],
        max: [5, "5 Is The Largest Rate Of Product"],

    },


    ratingCount: {

        type: Number,
        default: 0,

    },


}, { timestamps: true });




const productModel = mongoose.model("product", productSchema);


export default productModel;