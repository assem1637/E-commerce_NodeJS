import mongoose from "mongoose";



const brandSchema = mongoose.Schema({


    name: {

        type: String,
        required: [true, "Name Of Brand Is Required"],
        trim: true,
        lowercase: true,
        unique: [true, "Name Of Brand Is Unique"],
        minlength: [2, "2 Is The Lowest Name Of Brand"],
        maxlength: [30, "30 Is The Largest Name Of Brand"]

    },


    slug: {

        type: String,
        lowercase: true,

    },



    image: {

        type: String,
        required: [true, "Image Of Brand Is Required"],

    },


}, { timestamps: true });



const brandModel = mongoose.model("brand", brandSchema);


export default brandModel;