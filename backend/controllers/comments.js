const reqdb = require('../models/comments');
const reg = require('../modules/regex');

exports.post = (req, res, next) => {
    let texte_secure;
    if (req.body.texte) { texte_secure = reg.bbcode(req.body.texte); }
    else { return res.status(500).json({ message: 'Le commentaire ne doit pas être vide.' }); }
    const data = [
        req.body.user_id,
        req.body.id_post,
        texte_secure,
    ];
    reqdb.ajoutComment(data, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ message: 'Le commentaire a bien été posté.' });
    });
};

exports.get = (req, res, next) => {
    reqdb.recupComments([req.body.id_post], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ comments: result });
    });
};
