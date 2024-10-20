const util = require("util");
const path = require("path");
const multer = require("multer");
const maxsize = 2 * 1024 * 1024;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, "images");
    } else if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("wordprocessingml")
    ) {
      cb(null, "documents");
    }
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const originalName = path.basename(file.originalname, extension);
    const timestamp = Date.now();
    let fileType = "";

    if (file.mimetype.includes("pdf")) {
      fileType = "pdf";
    } else if (
      file.mimetype.includes("msword") ||
      file.mimetype.includes("wordprocessingml")
    ) {
      fileType = "docx";
    }

    if (file.mimetype.includes("image")) {
      cb(null, `${timestamp}-${Math.round(Math.random() * 1e2)}${extension}`);
    } else {
      // Append the file type (pdf or word) to the document file name
      cb(null, `${originalName}-${fileType}-${timestamp}${extension}`);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImages = multer({
  storage: storage,
  limits: maxsize,
  fileFilter: fileFilter,
});

const uploadImagesMiddleware = util.promisify(
  uploadImages.fields([
    { name: "image", maxCount: 10 },
    { name: "document", maxCount: 10 },
  ])
);

module.exports = uploadImagesMiddleware;
