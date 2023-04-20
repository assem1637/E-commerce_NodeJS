import brandModel from "./brand.model.js";
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








// Get All Brands

export const getAllBrands = ErrorHandler(async (req, res, next) => {

    const allBrands = await brandModel.find({});
    res.status(200).json({ message: "Success", data: allBrands });

});





// Create New Brand

export const createNewBrand = ErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findOne({ name: (req.body.name).toLowerCase() });

    if (brand) {

        res.status(400).json({ message: `The Brand: ${brand.name} Is Already Here` });

    } else {


        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };


        const newBrand = brandModel(req.body);
        await newBrand.save();


        res.status(200).json({ message: "Success", data: newBrand });

    };

});






// Get Specific Brand By Id

export const getSpecificBrand = ErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findOne({ _id: req.params.id });

    if (brand) {

        res.status(200).json({ message: "Success", data: brand });

    } else {

        res.status(400).json({ message: "Not Found Brand" });

    };

});







// Update Specific Brand By Id

export const updateSpecificBrand = ErrorHandler(async (req, res, next) => {

    let brand = await brandModel.findOne({ _id: req.params.id });

    if (brand) {


        if (req.body.name) {

            req.body.slug = slugify(req.body.name);

        };


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };



        brand = await brandModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        res.status(200).json({ message: "Success Updated", data: brand });


    } else {

        res.status(400).json({ message: "Not Found Brand" });

    };

});







// Delete Specific Brand By Id

export const deleteSpecificBrand = ErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findOneAndDelete({ _id: req.params.id });

    if (brand) {

        res.status(200).json({ message: "Success Deleted", data: brand });

    } else {

        res.status(400).json({ message: "Not Found Brand" });

    };

});