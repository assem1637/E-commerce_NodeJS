import mongoose from "mongoose";






const cartSchema = mongoose.Schema({



    userId: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: [true, "ID Of User Is Required To Create Your Cart"],

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
                default: 1,

            },

        },

    ],




    totalPrice: {

        type: Number,

    },



    discount: {

        type: Number,
        default: 0,

    },


    couponName: {

        type: String,

    },

    totalPriceAfterDiscount: {

        type: Number,

    },



}, { timestamps: true });



const cartModel = mongoose.model("cart", cartSchema);



export default cartModel;