const express = require('express');

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

module.exports = app;
