const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded_token = jwt.verify(token, 'WIOd89ELnQyArth1dGK2fSm7hnJit7U7');
        if (req.body.user_id === decoded_token.user_id && req.body.user_status === decoded_token.user_status) {
            next();
        } else {
            throw 'Erreur : token d\'authentification invalide';
        }
    } catch (error) {
        res.status(401).json({ message: error });
    }
};
