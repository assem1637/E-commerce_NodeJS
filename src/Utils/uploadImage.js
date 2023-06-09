import multer from 'multer';







const coreUpload = () => {


    const storage = multer.diskStorage({});


    function fileFilter(req, file, cb) {


        if (file.mimetype.startsWith("image")) {

            cb(null, true);

        } else {

            cb(`Upload Image Only`, false);

        };

    }


    const upload = multer({ storage, fileFilter });


    return upload;

};




// Upload Single Image

export const uploadSingleImage = (name) => {

    return coreUpload().single(name);

};




// Upload Fields Image

export const uploadFieldsImage = (fields) => {

    return coreUpload().fields(fields);

};