const db = require('./db');

exports.ajoutComment = (data, callback) => {
    db.query(`
        INSERT INTO Commentaires (id_membres, id_posts, date_post, message)
        VALUES (?, ?, NOW(), ?)
    `, data, callback);
};

exports.recupComments = (data, callback) => {
    db.query(`
        SELECT 1 AS show_comment, c.id, c.id_membres, DATE_FORMAT(c.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, c.message, m.nom, m.prenom, m.avatar, m.status
        FROM Commentaires AS c
        LEFT JOIN Membres AS m
        ON c.id_membres = m.id
        WHERE c.id_posts = ?
        ORDER BY c.date_post DESC
    `, data, callback);
};

exports.recupIdStatusAuteur = (data, callback) => {
    db.query(`
        SELECT m.id, m.status
        FROM Membres AS m
        INNER JOIN Commentaires AS c
        ON m.id = c.id_membres
        WHERE c.id = ?
    `, data, callback);
};

exports.deleteComment = (data, callback) => {
    db.query(`
        DELETE FROM Commentaires
        WHERE id = ?
    `, data, callback);
};
