const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const user_id = req.query.user_id !== undefined ? parseInt(req.query.user_id, 10) : req.body.user_id;
        const user_status = req.query.user_status !== undefined ? parseInt(req.query.user_status, 10) : req.body.user_status;
        const token = req.headers.authorization.split(' ')[1];
        const decoded_token = jwt.verify(token, 'WIOd89ELnQyArth1dGK2fSm7hnJit7U7');
        if (user_id === decoded_token.user_id && user_status === decoded_token.user_status) {
            next();
        } else {
            throw 'Erreur : token d\'authentification invalide';
        }
    } catch (error) {
    res.status(401).json({ message: error });
    }
};
