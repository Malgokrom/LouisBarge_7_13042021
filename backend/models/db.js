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

module.exports = apidb;
