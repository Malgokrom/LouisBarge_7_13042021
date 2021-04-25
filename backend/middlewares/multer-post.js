const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images/posts');
    },
    filename: (req, file, callback) => {
        callback(null, req.params.iduser + '-' + Date.now() + '.' + MIME_TYPES[file.mimetype]);
    }
});

module.exports = multer({ storage: storage }).single('image');
