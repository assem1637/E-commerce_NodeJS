import mongoose from "mongoose";





const categorySchema = mongoose.Schema({


    name: {

        type: String,
        required: [true, "Name Of Category Is Required"],
        trim: true,
        unique: [true, "Name Of Category Is Unique"],
        minlength: [3, "3 Is The Lowest Name Of Category"],
        maxlength: [30, "30 Is The Largest Name Of Category"],
        lowercase: true

    },


    slug: {

        type: String,
        required: [true, "Slug Of Category Is Required"],
        lowercase: true,

    },



    image: {

        type: String,
        required: [true, "Image Of Category Is Required"],

    }

}, { timestamps: true });





const categoryModel = mongoose.model("category", categorySchema);




export default categoryModel;