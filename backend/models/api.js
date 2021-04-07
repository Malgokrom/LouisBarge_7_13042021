const mysql = require('mysql');

const apidb = mysql.createConnection({
    host: 'localhost',
    user: 'api',
    password: 'yhislmdvjhuv',
    database: 'gmreseau'
});

apidb.connect((error) => {
    if (error) { throw error; }
    console.log('Connexion à la base de données réussie');
});

exports.ajoutMembre = (data, callback) => {
    apidb.query(`
        INSERT INTO Membres (nom, prenom, email, mdp, date_inscription, derniere_connexion)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    `, data, callback);
};

exports.recupMembre = (data, callback) => {
    apidb.query(`
        SELECT *
        FROM Membres
        WHERE email = ?
    `, data, callback);
};

exports.majDerniereConnexion = (data, callback) => {
    apidb.query(`
        UPDATE Membres
        SET derniere_connexion = NOW()
        WHERE id = ?
    `, data, callback);
};
