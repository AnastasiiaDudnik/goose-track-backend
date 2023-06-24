const multer = require("multer");
const path = require("path");

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newName = `${uniquePreffix}_${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({ storage });

module.exports = upload;
