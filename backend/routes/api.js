const express = require('express');

const apiCtrl = require('../controllers/api');

const router = express.Router();

router.post('/signup', apiCtrl.signup);
router.post('/login', apiCtrl.login);

module.exports = router;
