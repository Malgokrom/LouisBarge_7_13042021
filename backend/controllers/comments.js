const reqdb = require('../models/comments');
const reg = require('../modules/regex');

exports.postComment = (req, res, next) => {
    let texte_secure;
    if (req.body.texte) { texte_secure = reg.bbcode(req.body.texte); }
    else { return res.status(500).json({ message: 'Le commentaire ne doit pas être vide.' }); }
    const data = [
        req.body.user_id,
        parseInt(req.params.idpost, 10),
        texte_secure,
    ];
    reqdb.ajoutComment(data, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ message: 'Le commentaire a bien été posté.' });
    });
};

exports.getComments = (req, res, next) => {
    reqdb.recupComments([parseInt(req.params.idpost, 10)], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ comments: result });
    });
};

exports.deleteComment = (req, res, next) => {
    const user_id = req.body.user_id;
    const user_status = req.body.user_status;
    const id_comment = parseInt(req.params.idcomment, 10);
    reqdb.recupIdStatusAuteur([id_comment], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        const auteur_id = result.length ? result[0].id : -1;
        const auteur_status = result.length ? result[0].status : -1;
        if (user_id === auteur_id || user_status === 9 || (user_status === 1 && auteur_status !== 9)) {
            reqdb.deleteComment([id_comment]);
            return res.status(200).json({ message: 'Le commentaire a bien été supprimé.' });
        }
        res.status(401).json({ message: 'Vous n\'avez pas l\'autorisation de supprimer ce commentaire.' });
    });
};
