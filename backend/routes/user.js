const express = require('express');

const userCtrl = require('../controllers/user');

const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.put('/preferences', userCtrl.updatePreferences);
router.post('/membre', auth, userCtrl.getOneMembre);
router.post('/tous', auth, userCtrl.getAllMembres);
router.post('/get', auth, userCtrl.get);
router.put('/update', auth, userCtrl.updateMembre);

module.exports = router;
