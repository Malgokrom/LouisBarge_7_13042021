const reqdb = require('../models/message');
const reg = require('../modules/regex');

exports.post = (req, res, next) => {
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

exports.get = (req, res, next) => {
    const tri = req.body.search.tri;
    const membre_suppr = req.body.search.membre_suppr;
    const date_apres = req.body.search.date_apres;
    const date_avant = req.body.search.date_avant;
    const nom = '%' + req.body.search.nom + '%';
    const prenom = '%' + req.body.search.prenom + '%';
    const status = parseInt(req.body.search.status, 10);
    const texte = req.body.search.texte;
    const data = [ date_apres, date_avant, nom, prenom, status, status, texte ];
    reqdb.searchMessages(data, tri, membre_suppr, texte, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ posts: result });
    });
};
