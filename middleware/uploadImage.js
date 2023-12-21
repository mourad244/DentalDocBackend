const multer = require("multer");
const util = require("util");
const path = require("path");
const maxsize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImage = multer({
  storage: storage,
  limits: { fileSize: maxsize },
  fileFilter: fileFilter,
}).single("image");

const uploadImageMiddleware = util.promisify(uploadImage);

module.exports = uploadImageMiddleware;
