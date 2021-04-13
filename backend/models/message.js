const db = require('./db');

exports.ajoutMessage = (data, callback) => {
    db.query(`
        INSERT INTO Posts (id_membres, date_post, message, image)
        VALUES (?, NOW(), ?, ?)
    `, data, callback);
};

exports.recupMessages = (callback) => {
    db.query(`
        SELECT p.id_membres, DATE_FORMAT(p.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, p.message, p.image, m.nom, m.prenom, m.avatar, m.status
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
        SELECT p.id_membres, DATE_FORMAT(p.date_post, '%d/%m/%Y %H:%i:%s') AS date_post, p.message, p.image, m.nom, m.prenom, m.avatar, m.status
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
