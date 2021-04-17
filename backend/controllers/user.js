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
        const new_membre = [
            req.body.nom,
            req.body.prenom,
            req.body.email,
            hash
        ];
        reqdb.ajoutMembre(new_membre, (error, result) => {
            if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
            res.status(201).json({ message: 'Le compte utilisateur a bien été créé.' });
        });
    }).catch(() => {
        res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' });
    });
};

exports.login = (req, res, next) => {
    reqdb.recupMembreByEmail([req.body.email], (error, result) => {
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

exports.getOneMembre = (req, res, next) => {
    reqdb.recupInfosProfil([req.body.id], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        if (result.length) { return res.status(200).json({ profil: result[0] }); }
        res.status(500).json({ message: 'Cet utilisateur n\'existe pas.' });
    });
};

exports.getAllMembres = (req, res, next) => {
    reqdb.recupMembres((error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ membres: result });
    });
};

exports.get = (req, res, next) => {
    const tri = req.body.search.tri;
    const date_apres = req.body.search.date_apres;
    const date_avant = req.body.search.date_avant;
    const nom = '%' + req.body.search.nom + '%';
    const prenom = '%' + req.body.search.prenom + '%';
    const email = '%' + req.body.search.email + '%';
    const status = parseInt(req.body.search.status, 10);
    const data = [ date_apres, date_avant, nom, prenom, email, status, status ];
    reqdb.searchMembres(data, tri, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ membres: result });
    });
};

exports.updateMembre = (req, res, next) => {
    if (req.body.supprimer) {
        reqdb.deleteMembre([req.body.user_id], (error, result) => {
            if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
            res.status(200).json({ message: 'Votre compte a bien été supprimé.' });
        });
    } else {
        reqdb.recupMembreById([req.body.user_id], (error, result) => {
            if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
            bcrypt.compare(req.body.old_mdp, result[0].mdp).then((valid) => {
                if (!valid) { return res.status(401).json({ message: 'Le mot de passe est incorrect.' }); }
                const regex_nom = /^[-a-zA-ZœçàâäéèêëîïôöùûüŷÿŒÇÀÂÄÉÈÊËÎÏÔÖÙÛÜŶŸ\s]{1,64}$/;
                const regex_email = /^[-._a-zA-Z0-9]+@[-._a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/;
                const regex_mdp = /^.{8,64}$/;
                const new_nom = req.body.nom ? req.body.nom : result[0].nom;
                const new_prenom = req.body.prenom ? req.body.prenom : result[0].prenom;
                const new_email = req.body.email ? req.body.email : result[0].email;
                const new_mdp = req.body.new_mdp ? req.body.new_mdp : '';
                if (!regex_nom.test(new_nom) || !regex_nom.test(new_prenom) || !regex_email.test(new_email) || (new_mdp && !regex_mdp.test(new_mdp))) {
                    return res.status(500).json({ message: 'Les données reçues par le serveur sont invalides.' });
                }
                let new_description;
                if (req.body.description) {
                    new_description = req.body.description
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\[(\/?(b|i|u|s|sub|sup))\]/gi, '<$1>')
                    .replace(/((https?|ftp|ssh):\/\/[a-z0-9\/:%_+.,#?!@&=-]+)/g, '<a href="$1" target="_blank">$1</a>')
                    .replace(/\n/g, '<br />');
                } else { new_description = result[0].description; }
                if (new_mdp) {
                    bcrypt.hash(new_mdp, 10).then((hash) => {
                        const new_data = [ new_nom, new_prenom, new_email, hash, new_description, req.body.user_id ];
                        reqdb.updateMembre(new_data, (error, result) => {
                            if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
                            reqdb.recupMembreById([req.body.user_id], (error, result) => {
                                if (error) { res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
                                res.status(200).json({
                                    message: 'Votre compte a bien été modifié.',
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
                                    }
                                });
                            });
                        });
                    }).catch(() => {
                        res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' });
                    });
                } else {
                    const new_data = [ new_nom, new_prenom, new_email, result[0].mdp, new_description, req.body.user_id ];
                    reqdb.updateMembre(new_data, (error, result) => {
                        if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
                        reqdb.recupMembreById([req.body.user_id], (error, result) => {
                            if (error) { res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
                            res.status(200).json({
                                message: 'Votre compte a bien été modifié.',
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
                                }
                            });
                        });
                    });
                }
            });
        });
    }
};
