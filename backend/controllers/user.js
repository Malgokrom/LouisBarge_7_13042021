const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const reg = require('../modules/regex');
const reqdb = require('../models/user');

exports.signup = (req, res, next) => {
    if (!reg.nom.test(req.body.nom) || !reg.nom.test(req.body.prenom) || !reg.email.test(req.body.email) || !reg.mdp.test(req.body.mdp)) {
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
    reqdb.recupInfosLogin([req.query.email], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        if (result.length) {
            bcrypt.compare(req.query.mdp, result[0].mdp).then((valid) => {
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
                    preferences: {
                        texte: result[0].texte,
                        police: result[0].police
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

exports.updatePreferences = (req, res, next) => {
    const new_pref = [
        req.body.texte,
        req.body.police,
        req.body.user_id
    ];
    reqdb.updatePreferences(new_pref, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ message: 'Vos préférences ont bien été sauvegardé.' });
    });
};

exports.getOneMembre = (req, res, next) => {
    reqdb.recupInfosProfil([parseInt(req.params.idmembre, 10)], (error, result) => {
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

exports.searchMembres = (req, res, next) => {
    const tri = req.query.tri;
    const date_apres = req.query.date_apres;
    const date_avant = req.query.date_avant;
    const nom = '%' + req.query.nom + '%';
    const prenom = '%' + req.query.prenom + '%';
    const email = '%' + req.query.email + '%';
    const status = parseInt(req.query.status, 10);
    const data = [ date_apres, date_avant, nom, prenom, email, status, status ];
    reqdb.searchMembres(data, tri, (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        res.status(200).json({ membres: result });
    });
};

exports.setStatus = (req, res, next) => {
    if (req.body.user_status === 9) {
        const data = [
            req.body.status,
            req.body.id
        ];
        reqdb.majStatus(data, (error, result) => {
            if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
            res.status(200).json({ message: 'Le status du membre a bien été modifié.' });
        });
    } else {
        res.status(401).json({ message: 'Vous n\'avez pas l\'autorisation de modifier le status d\'un membre.' });
    }
};

exports.deleteMembre = (req, res, next) => {
    if (req.body.user_status === 9) {
        reqdb.recupMembreById([req.params.idmembre], (error, result) => {
            if (result[0].avatar !== '0.png') { fs.unlink('images/avatars/' + result[0].avatar, () => {}); }
            reqdb.deleteMembre([req.params.idmembre], (error, result) => {
                if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
                res.status(200).json({ message: 'Le profil a bien été supprimé.' });
            }); 
        });
    } else {
        res.status(401).json({ message: 'Vous n\'avez pas l\'autorisation de supprimer un profil.' });
    }
};

exports.updateMembre = (req, res, next) => {
    const user_id = parseInt(req.params.iduser, 10);
    reqdb.recupMembreById([user_id], (error, result) => {
        if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
        const old_image = result[0].avatar;
        const new_image = req.file ? req.file.filename : old_image;
        bcrypt.compare(req.body.old_mdp, result[0].mdp).then((valid) => {
            if (!valid) {
                if (req.file) { fs.unlink('images/avatars/' + new_image, () => {}); }
                return res.status(401).json({ message: 'Le mot de passe est incorrect.' });
            }
            if (req.body.supprimer === 'true') {
                reqdb.deleteMembre([user_id], (error, result) => {
                    if (old_image !== '0.png') { fs.unlink('images/avatars/' + old_image, () => {}); }
                    if (error) { return res.status(500).json({ message: 'Une erreur s\'est produite sur le serveur.' }); }
                    res.status(200).json({ message: 'Votre compte a bien été supprimé.' });
                });
            } else {
                const new_nom = req.body.nom ? req.body.nom : result[0].nom;
                const new_prenom = req.body.prenom ? req.body.prenom : result[0].prenom;
                const new_email = req.body.email ? req.body.email : result[0].email;
                const new_mdp = req.body.new_mdp ? req.body.new_mdp : '';
                if (!reg.nom.test(new_nom) || !reg.nom.test(new_prenom) || !reg.email.test(new_email) || (new_mdp && !reg.mdp.test(new_mdp))) {
                    return res.status(500).json({ message: 'Les données reçues par le serveur sont invalides.' });
                }
                if (req.file && old_image !== '0.png') { fs.unlink('images/avatars/' + old_image, () => {}); }
                const new_description = req.body.description ? reg.bbcode(req.body.description) : result[0].description;
                if (new_mdp) {
                    bcrypt.hash(new_mdp, 10).then((hash) => {
                        const new_data = [ new_nom, new_prenom, new_email, hash, new_description, new_image, user_id ];
                        reqdb.updateMembre(new_data, (error, result) => {
                            if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
                            reqdb.recupMembreById([user_id], (error, result) => {
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
                    const new_data = [ new_nom, new_prenom, new_email, result[0].mdp, new_description, new_image, user_id ];
                    reqdb.updateMembre(new_data, (error, result) => {
                        if (error) { return res.status(500).json({ message: 'Cet email est déjà utilisé.' }); }
                        reqdb.recupMembreById([user_id], (error, result) => {
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
            }
        });
    });
};
