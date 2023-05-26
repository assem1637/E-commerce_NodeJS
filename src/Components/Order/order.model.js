import mongoose from "mongoose";






const ValidateThePhone = (phone) => {

    return phone.match(/^01(0|1|2|5)[0-9]{8}$/) ? true : false;

};




const orderSchema = mongoose.Schema({


    userId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: [true, "ID Of User Is Required To Create Your Order"],

    },



    cartItems: [

        {

            product: {

                type: mongoose.SchemaTypes.ObjectId,
                ref: "products",
                required: [true, "ID Of Product Is Required To Add To Cart"],

            },


            price: {

                type: Number,
                required: [true, "Price Of Product Is Required To Add To Cart"],

            },


            quantity: {

                type: Number,

            },

        },

    ],



    shippingAddress: {

        name: {

            type: String,
            required: [true, "Name Of Shipping Address Is Required"],
            minlength: [3, "3 Is The Lowest Name Of Address"],
            maxlength: [50, "50 Is The Largest Name Of Address"],

        },


        address: {

            type: String,
            required: [true, "Address Of Shipping Address Is Required"],
            minlength: [5, "5 Is The Lowest Address"],
            maxlength: [100, "100 Is The Largest Address"],

        },


        phone: {

            type: String,
            required: [true, "Phone Of Shipping Address Is Required"],
            validate: [ValidateThePhone, "It's Must Be A Egyption Phone Valid"],

        },



        location: {

            type: String,
            enum: ["home", "work"],
            default: "home",

        },

    },




    totalPrice: {

        type: Number,
        required: [true, "Total Price Of Order Is Required"],

    },


    taxPrice: {

        type: Number,
        default: 0,

    },


    shippingPrice: {

        type: Number,
        default: 0,

    },



    finalTotalPrice: {

        type: Number,
        required: [true, "Final Total Price Of Order Is Required"],

    },



    paymentMethods: {

        type: String,
        enum: ["cash", "visa"],
        default: "cash",

    },



    isPayed: {

        type: Boolean,
        default: false,

    },


    payedAt: {

        type: Date,

    },


    isDelivered: {

        type: Boolean,
        default: false,

    },


    deliveredAt: {

        type: Date,

    },


}, { timestamps: true });



const orderModel = mongoose.model("order", orderSchema);



export default orderModel;