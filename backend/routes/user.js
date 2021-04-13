const express = require('express');

const userCtrl = require('../controllers/user');

const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/membre', auth, userCtrl.getOneMembre);

module.exports = router;
