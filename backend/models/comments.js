const db = require('./db');

exports.ajoutComment = (data, callback) => {
    db.query(`
        INSERT INTO Commentaires (id_membres, id_posts, date_post, message)
        VALUES (?, ?, NOW(), ?)
    `, data, callback);
};

exports.recupComments = (data, callback) => {
    db.query(`
        SELECT c.id_membres, DATE_FORMAT(c.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, c.message, m.nom, m.prenom, m.avatar
        FROM Commentaires AS c
        LEFT JOIN Membres AS m
        ON c.id_membres = m.id
        WHERE id_posts = ?
        ORDER BY c.date_post DESC
    `, data, callback);
};
