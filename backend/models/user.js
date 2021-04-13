const db = require('./db');

exports.ajoutMembre = (data, callback) => {
    db.query(`
        INSERT INTO Membres (nom, prenom, email, mdp, date_inscription, derniere_connexion)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `, data, callback);
};

exports.recupMembre = (data, callback) => {
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
