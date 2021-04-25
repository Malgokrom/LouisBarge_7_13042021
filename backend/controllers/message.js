const fs = require('fs');

const reqdb = require('../models/message');
const reg = require('../modules/regex');

exports.addPost = (req, res, next) => {
    const user_id = parseInt(req.params.iduser, 10);
    const texte_secure = reg.bbcode(req.body.texte);
    const image = req.file ? req.file.filename : null;
    const data = [ user_id, texte_secure, image ];
    if (!texte_secure && !image) { return res.status(500).json({ message: 'Le post doit contenir du texte et/ou une image.' }); }
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
    const user_id = req.body.user_id;
    const user_status = req.body.user_status;
    const id_post = parseInt(req.params.idpost, 10);
    reqdb.recupInfosSuppr([id_post], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        const auteur_id = result.length ? result[0].id : -1;
        const auteur_status = result.length ? result[0].status : -1;
        const post_image = result.length ? result[0].image : null;
        if (user_id === auteur_id || user_status === 9 || (user_status === 1 && auteur_status !== 9)) {
            if (post_image) { fs.unlink('images/posts/' + post_image, () => {}); }
            reqdb.deleteMessage([id_post]);
            return res.status(200).json({ message: 'Le post a bien été supprimé.' });
        }
        res.status(401).json({ message: 'Vous n\'avez pas l\'autorisation de supprimer ce message.' });
    });
};
