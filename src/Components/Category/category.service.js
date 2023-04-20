import categoryModel from "./category.model.js";
import apiError from "../../Utils/apiError.js";
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






// Get All Categories

export const getAllCategories = ErrorHandler(async (req, res, next) => {

    const allCategories = await categoryModel.find({});
    res.status(200).json({ message: "Success", data: allCategories });

});







// Create New Category 

export const createNewCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOne({ name: (req.body.name).toLowerCase() });


    if (category) {

        res.status(400).json({ message: `The Category: ${category.name} Is Already Here` });

    } else {


        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };



        const newCategory = categoryModel(req.body);
        await newCategory.save();

        res.status(200).json({ message: "Success", data: newCategory });

    };

});








// Get Specific Category By Id

export const getSpecificCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOne({ _id: req.params.id });

    if (category) {

        res.status(200).json({ message: "Success", data: category });

    } else {

        res.status(400).json({ message: "Not Found Category" });

    };

});







// Update Specific Category By Id

export const updateSpecificCategory = ErrorHandler(async (req, res, next) => {

    let category = await categoryModel.findOne({ _id: req.params.id });

    if (category) {

        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };


        category = await categoryModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        res.status(200).json({ message: "Success Updated", data: category });


    } else {

        res.status(400).json({ message: "Not Found Category" });

    };

});








// Delete Specific Category By Id

export const deleteSpecificCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOneAndDelete({ _id: req.params.id });


    if (category) {

        res.status(200).json({ message: "Success Deleted", data: category });

    } else {

        res.status(400).json({ message: "Not Found Category" });

    };

});