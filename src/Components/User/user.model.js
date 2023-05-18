import mongoose from "mongoose";





const ValidateThePhone = (phone) => {

    return phone.match(/^01(0|1|2|5)[0-9]{8}$/) ? true : false;

};



const userSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of Account Is Required"],
        minlength: [3, "3 Is The Lowest Name Of Account"],
        maxlength: [50, "50 Is The Largest Name Of Account"],

    },


    age: {

        type: Number,
        required: [true, "Age Of Account Is Required"],
        min: [4, "4 Is The Lowest Age Of Account"],
        max: [130, "130 Is The Largest Age Of Account"],

    },


    phone: {

        type: String,
        required: [true, "Phone Of Account Is Required"],
        validate: [ValidateThePhone, "It's Must Be A Egyption Phone Valid"],

    },



    email: {

        type: String,
        required: [true, "Email Of Account Is Required"],

    },


    emailConfirm: {

        type: Boolean,
        default: false,

    },



    password: {

        type: String,
        required: [true, "Password Of Account Is Required"],
        minlength: [6, "6 Is The Lowest Password Of Account"],
        maxlength: [100, "100 Is The Largest Password Of Account"],

    },



    rePassword: {

        type: String,
        required: [true, "rePassword Of Account Is Required"],
        minlength: [6, "6 Is The Lowest rePassword Of Account"],
        maxlength: [100, "100 Is The Largest rePassword Of Account"],

    },



    role: {

        type: String,
        enum: ["user", "admin"],
        default: "user",

    },



    isActive: {

        type: Boolean,
        default: true,

    },



    profileImage: {

        type: String,

    },



    resetCode: {

        type: String,

    },


    resetCodeAt: {

        type: Date

    },


    changePasswordAt: {

        type: Date,

    },



    WishList: [

        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "products"
        },

    ],


}, { timestamps: true });



const userModel = mongoose.model("user", userSchema);



export default userModel;