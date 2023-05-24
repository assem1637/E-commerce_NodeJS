import mongoose from "mongoose";







const couponSchema = mongoose.Schema({


    code: {

        type: String,
        required: [true, "Code Of Coupon Is Required"],
        trim: true,
        unique: [true, "Code Of Coupon Is Unique"],
        uppercase: true,

    },



    discount: {

        type: Number,
        required: [true, "Discount Of Coupon Is Required"],

    },



    expire: {

        type: Date,
        required: [true, "Expire Of Coupon Is Required"],

    },



    numberOfAvailable: {

        type: Number,
        required: [true, "Number Of Times Available Of Coupon Is Required"],

    },


    userUsed: [

        { type: mongoose.SchemaTypes.ObjectId, ref: "user" },

    ],


}, { timestamps: true });




const couponModel = mongoose.model("coupon", couponSchema);




export default couponModel;