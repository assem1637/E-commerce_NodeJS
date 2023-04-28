import productModel from './product.model.js';
import apiError from '../../Utils/apiError.js';
import cloudinary from "cloudinary";
import slugify from "slugify";





// Configuration 
cloudinary.config({
    cloud_name: "drfegeke8",
    api_key: "119752893581328",
    api_secret: "BULOuHNhe80eEp4GP9kvph02pdk"
});






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};








// Get All Products

export const getAllProducts = ErrorHandler(async (req, res, next) => {

    const allProducts = await productModel.find({}).populate("category subCategory brand");
    res.status(200).json({ message: "Success", data: allProducts });

});






// Create New Product

export const createNewProduct = ErrorHandler(async (req, res, next) => {

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.files.imageCover) {

        const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
        req.body.imageCover = cloud.secure_url;

    };



    if (req.files.images) {

        let List_Of_Path = [];
        let Links_Of_Images = [];


        (req.files.images).forEach((image) => {

            List_Of_Path.push(image.path);

        });



        for (let x = 0; x < List_Of_Path.length; x++) {

            const cloud = await cloudinary.uploader.upload(List_Of_Path[x]);
            Links_Of_Images.push(cloud.secure_url);

        };


        req.body.images = Links_Of_Images;

    };




    const newProduct = productModel(req.body);
    await newProduct.save();

    res.status(200).json({ message: "Success", data: newProduct });

});








// Get Specific Product By Id

export const getSpecificProduct = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOne({ _id: req.params.id });

    if (product) {

        res.status(200).json({ message: "Success", data: product });

    } else {

        res.status(400).json({ message: "Not Found Product" });

    };

});







// Update Specific Product

export const updateSpecificProduct = ErrorHandler(async (req, res, next) => {

    let product = await productModel.findOne({ _id: req.params.id });


    if (product) {


        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        if (req.files.imageCover) {

            const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
            req.body.imageCover = cloud.secure_url;

        };



        if (req.files.images) {

            let List_Of_Path = [];
            let Links_Of_Images = [];


            (req.files.images).forEach((image) => {

                List_Of_Path.push(image.path);

            });



            for (let x = 0; x < List_Of_Path.length; x++) {

                const cloud = await cloudinary.uploader.upload(List_Of_Path[x]);
                Links_Of_Images.push(cloud.secure_url);

            };


            req.body.images = Links_Of_Images;

        };


        product = await productModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        res.status(200).json({ message: "Success Updated", data: product });


    } else {

        res.status(400).json({ message: "Not Found Product" });

    };

});








// Delete Specific Product

export const deleteSpecificProduct = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOneAndDelete({ _id: req.params.id });

    if (product) {

        res.status(200).json({ message: "Success Deleted", data: product });

    } else {

        res.status(400).json({ message: "Not Found Product" });

    };

});