const db = require('./db');

exports.ajoutMembre = (data, callback) => {
    db.query(`
        INSERT INTO Membres (nom, prenom, email, mdp, date_inscription, derniere_connexion)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `, data, callback);
};

exports.recupMembreByEmail = (data, callback) => {
    db.query(`
        SELECT *
        FROM Membres
        WHERE email = ?
    `, data, callback);
};

exports.majDerniereConnexion = (data, callback) => {
    db.query(`
        UPDATE Membres
        SET derniere_connexion = NOW()
        WHERE id = ?
    `, data, callback);
};

exports.recupInfosProfil = (data, callback) => {
    db.query(`
        SELECT nom, prenom, email, DATE_FORMAT(date_inscription, '%d/%m/%Y') AS date_inscription, DATE_FORMAT(derniere_connexion, '%d/%m/%Y') AS derniere_connexion, description, avatar, status
        FROM Membres
        WHERE id = ?
    `, data, callback);
};

exports.recupMembres = (callback) => {
    db.query(`
        SELECT id, nom, prenom, email, avatar, status
        FROM Membres
        ORDER BY date_inscription DESC
    `, callback);
};

exports.searchMembres = (data, tri, callback) => {
    if (tri !== 'DESC') { tri = 'ASC'; }
    db.query(`
        SELECT id, nom, prenom, email, avatar, status
        FROM Membres
        WHERE date_inscription BETWEEN ? AND ADDDATE(?, 1)
            AND nom LIKE ?
            AND prenom LIKE ?
            AND email LIKE ?
            AND (status = ? OR -1 = ?)
        ORDER BY date_inscription ` + tri
    , data, callback);
};

exports.updateMembre = (data, callback) => {
    db.query(`
        UPDATE Membres
        SET nom = ?, prenom = ?, email = ?, mdp = ?, description = ?
        WHERE id = ?
    `, data, callback);
};

exports.deleteMembre = (data, callback) => {
    db.query(`
        DELETE FROM Membres
        WHERE id = ?
    `, data, callback);
};

exports.recupMembreById = (data, callback) => {
    db.query(`
        SELECT *
        FROM Membres
        WHERE id = ?
    `, data, callback);
};
