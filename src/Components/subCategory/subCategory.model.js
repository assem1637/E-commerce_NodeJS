import mongoose from "mongoose";



const subCategorySchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of subCategory Is Required"],
        trim: true,
        unique: [true, "Name Of subCategory Is Unique"],
        lowercase: true,
        minlength: [3, "3 Is The Lowest Name Of subCategory"],
        maxlength: [30, "30 Is The Largest Name Of subCategory"],

    },



    slug: {

        type: String,
        lowercase: true,

    },



    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "CategoryId Of subCategory Is Required"],

    }

}, { timestamps: true });




const subCategoryModel = mongoose.model("subCategory", subCategorySchema);


export default subCategoryModel;