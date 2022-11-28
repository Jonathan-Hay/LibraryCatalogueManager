const multer = require("multer");
//use v4 of the uuid package. Will give every image a unique id
const uuid = require("uuid").v4;

const upload = multer({
  storage: multer.diskStorage({
    //tell multer to store images in images foldera
    destination: "product-data/images",
    //
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  }),
});

//extract a SINGLE image by the field name 'image' from the incoming request. We gave the name field on the file input element
//on the form "image"
//So the multer middlware will look for the name form input field with name 'image'
const configuredMulterMiddleware = upload.single("image");

module.exports = configuredMulterMiddleware;
