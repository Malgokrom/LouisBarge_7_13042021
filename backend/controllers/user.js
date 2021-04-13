const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const reqdb = require('../models/user');

exports.signup = (req, res, next) => {
    const regex_nom = /^[-a-zA-ZœçàâäéèêëîïôöùûüŷÿŒÇÀÂÄÉÈÊËÎÏÔÖÙÛÜŶŸ\s]{1,64}$/;
    const regex_email = /^[-._a-zA-Z0-9]+@[-._a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/;
    const regex_mdp = /^.{8,64}$/;
    if (!regex_nom.test(req.body.nom) || !regex_nom.test(req.body.prenom) || !regex_email.test(req.body.email) || !regex_mdp.test(req.body.mdp)) {
        return res.status(500).json({ message: 'Les données reçues par le serveur sont invalides.' });
    }
    bcrypt.hash(req.body.mdp, 10).then((hash) => {
        const nouv_membre = [
            req.body.nom,
            req.body.prenom,
            req.body.email,
            hash
        ];
        reqdb.ajoutMembre(nouv_membre, (error, result) => {
            if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
            res.status(201).json({ message: 'Le compte utilisateur a bien été créé.' });
        });
    }).catch(() => {
        res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' });
    });
};

exports.login = (req, res, next) => {
    reqdb.recupMembre([req.body.email], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        if (result.length) {
            bcrypt.compare(req.body.mdp, result[0].mdp).then((valid) => {
                if (!valid) { return res.status(401).json({ message: 'Le mot de passe est incorrect.' }); }
                reqdb.majDerniereConnexion([result[0].id]);
                res.status(200).json({
                    user: {
                        id: result[0].id,
                        nom: result[0].nom,
                        prenom: result[0].prenom,
                        email: result[0].email,
                        date_inscription: result[0].date_inscription,
                        derniere_connexion: result[0].derniere_connexion,
                        description: result[0].description,
                        avatar: result[0].avatar,
                        status: result[0].status
                    },
                    token: jwt.sign(
                        { user_id: result[0].id,
                        user_status: result[0].status },
                        'WIOd89ELnQyArth1dGK2fSm7hnJit7U7',
                        { expiresIn: '24h' }
                    )
                });
            });
        } else {
            res.status(401).json({ message: 'Ce compte utilisateur n\'existe pas.' });
        }
    });
};
