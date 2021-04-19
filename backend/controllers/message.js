const reqdb = require('../models/message');
const reg = require('../modules/regex');

exports.addPost = (req, res, next) => {
    let texte_secure = reg.bbcode(req.body.texte);
    const data = [
        req.body.user_id,
        texte_secure,
        req.body.image
    ];
    /* Tester si le texte et l'image ne sont pas vides */
    reqdb.ajoutMessage(data, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ message: 'Le message a bien été posté.' });
    });
};

exports.getAllPosts = (req, res, next) => {
    reqdb.recupMessages((error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ posts: result });
    });
};

exports.searchPosts = (req, res, next) => {
    const tri = req.query.tri;
    const membre_suppr = req.query.membre_suppr === 'true' ? true : false;
    const date_apres = req.query.date_apres;
    const date_avant = req.query.date_avant;
    const nom = '%' + req.query.nom + '%';
    const prenom = '%' + req.query.prenom + '%';
    const status = parseInt(req.query.status, 10);
    const texte = req.query.texte;
    const data = [ date_apres, date_avant, nom, prenom, status, status, texte ];
    reqdb.searchMessages(data, tri, membre_suppr, texte, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ posts: result });
    });
};

exports.deletePost = (req, res, next) => {
    const user_status = req.body.user_status;
    const id_post = parseInt(req.params.idpost, 10);
    reqdb.recupStatusAuteur([id_post], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        const auteur_status = result.length ? result[0].status : -1;
        if (user_status === auteur_status || user_status === 9 || (user_status === 1 && auteur_status !== 9)) {
            reqdb.deleteMessage([id_post]);
            return res.status(200).json({ message: 'Le post a bien été supprimé.' });
        }
        res.status(401).json({ message: 'Vous n\'avez pas l\'autorisation de supprimer ce message.' });
    });
};
