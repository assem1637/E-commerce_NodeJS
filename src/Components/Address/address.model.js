import mongoose from "mongoose";





const ValidateThePhone = (phone) => {

    return phone.match(/^01(0|1|2|5)[0-9]{8}$/) ? true : false;

};



const addressSchema = mongoose.Schema({


    userId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: [true, "UserID Is Required"],

    },


    name: {

        type: String,
        required: [true, "Name Of Address Is Required"],
        minlength: [3, "3 Is The Lowest Name Of Address"],
        maxlength: [50, "50 Is The Largest Name Of Address"],

    },


    address: {

        type: String,
        required: [true, "Address Is Required"],
        minlength: [5, "5 Is The Lowest Address"],
        maxlength: [100, "100 Is The Largest Address"],

    },


    phone: {

        type: String,
        required: [true, "Phone Of Address Is Required"],
        validate: [ValidateThePhone, "It's Must Be A Egyption Phone Valid"],

    },


    location: {

        type: String,
        enum: ["home", "work"],
        default: "home",

    },



}, { timestamps: true });




const addressModel = mongoose.model("address", addressSchema);



export default addressModel;