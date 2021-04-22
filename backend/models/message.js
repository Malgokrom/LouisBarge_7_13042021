const db = require('./db');

exports.ajoutMessage = (data, callback) => {
    db.query(`
        INSERT INTO Posts (id_membres, date_post, message, image)
        VALUES (?, NOW(), ?, ?)
    `, data, callback);
};

exports.recupMessages = (callback) => {
    db.query(`
        SELECT 1 AS show_post, 0 AS show_comments, 0 AS post_comment, 0 AS num, p.id, p.id_membres, DATE_FORMAT(p.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, p.message, p.image, m.nom, m.prenom, m.avatar, m.status
        FROM Posts AS p
        LEFT JOIN Membres AS m
        ON p.id_membres = m.id
        ORDER BY p.date_post DESC
    `, callback);
};

exports.searchMessages = (data, tri, membre_suppr, texte, callback) => {
    if (tri !== 'DESC') { tri = 'ASC'; }
    const show_null = membre_suppr ? ' OR m.id IS NULL ' : '';
    const fulltext = texte ? ' AND MATCH(p.message) AGAINST (?) ' : '';
    db.query(`
        SELECT 1 AS show_post, 0 AS show_comments, 0 AS post_comment, 0 AS num, p.id, p.id_membres, DATE_FORMAT(p.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, p.message, p.image, m.nom, m.prenom, m.avatar, m.status
        FROM Posts AS p
        LEFT JOIN Membres AS m
        ON p.id_membres = m.id
        WHERE p.date_post BETWEEN ? AND ADDDATE(?, 1)
            AND (
                (
                    m.nom LIKE ?
                    AND m.prenom LIKE ?
                    AND (m.status = ? OR -1 = ?)
                )` + show_null + `
            )` + fulltext + `
        ORDER BY p.date_post ` + tri
    , data, callback);
};

exports.recupIdStatusAuteur = (data, callback) => {
    db.query(`
        SELECT m.id, m.status
        FROM Membres AS m
        INNER JOIN Posts AS p
        ON m.id = p.id_membres
        WHERE p.id = ?
    `, data, callback);
};

exports.deleteMessage = (data, callback) => {
    db.query(`
        DELETE FROM Posts
        WHERE id = ?
    `, data, callback);
};
