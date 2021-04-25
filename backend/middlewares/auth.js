const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let user_id, user_status;
        if (req.body.user_id !== undefined) { user_id = req.body.user_id; user_status = req.body.user_status; }
        else if (req.query.user_id !== undefined) { user_id = req.query.user_id; user_status = req.query.user_status; }
        else if (req.params.iduser !== undefined) { user_id = req.params.iduser; user_status = req.params.statususer; }
        else { throw 'Erreur : données d\'authentification requises'; }
        const token = req.headers.authorization.split(' ')[1];
        const decoded_token = jwt.verify(token, 'WIOd89ELnQyArth1dGK2fSm7hnJit7U7');
        if (user_id == decoded_token.user_id && user_status == decoded_token.user_status) {
            next();
        } else {
            throw 'Erreur : token d\'authentification invalide';
        }
    } catch (error) {
    res.status(401).json({ message: error });
    }
};
