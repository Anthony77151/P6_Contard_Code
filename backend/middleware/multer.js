const multer = require('multer');

// multer
const storage = multer.diskStorage({
    destination: "images/",
    filename: (req, file, cb) => {
        cb(null, makeFilename(req, file));
    }
});

// créer le nom du fichier (image)
function makeFilename(req, file) {
    const filename = `${Date.now()}-${file.originalname}`.replace(/\s/g, '-');
    file.filename = filename;
    return filename;
}

const upload = multer({ storage });

module.exports = { upload };