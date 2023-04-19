import subCategoryModel from "./subCategory.model.js";
import apiError from "../../Utils/apiError.js";
import slugify from "slugify";







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new apiError(err.message, 404));

        });

    };

};








// Get All subCategories

export const getAllSubCategories = ErrorHandler(async (req, res, next) => {

    const allSubCategories = await subCategoryModel.find({}).populate("category");
    res.status(200).json({ message: "Success", data: allSubCategories });

});






// Create New subCategory

export const createNewSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOne({ name: req.body.name });

    if (subCategory) {

        res.status(400).json({ message: `The Category: ${subCategory.name} Is Already Here` });

    } else {

        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        const newSubCategory = subCategoryModel(req.body);
        await newSubCategory.save();

        res.status(200).json({ message: "Success", data: newSubCategory });

    };

});









// Get Specific subCategory By Id

export const getSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOne({ _id: req.params.id });

    if (subCategory) {

        res.status(200).json({ message: "Success", data: subCategory });

    } else {

        res.status(400).json({ message: "Not Found subCategory" });

    };

});







// Update Specific subCategory By Id

export const updateSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    let subCategory = await subCategoryModel.findOne({ _id: req.params.id });

    if (subCategory) {


        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        subCategory = await subCategoryModel.findOneAndUpdate({ _id: req.params.id }, req.body);

        res.status(200).json({ message: "Success Updated", data: subCategory });


    } else {

        res.status(400).json({ message: "Not Found subCategory" });

    };

});








// Delete Specific subCategory

export const deleteSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOneAndDelete({ _id: req.params.id });

    if (subCategory) {

        res.status(200).json({ message: "Success Deleted", data: subCategory });

    } else {

        res.status(400).json({ message: "Not Found subCategory" });

    };

});