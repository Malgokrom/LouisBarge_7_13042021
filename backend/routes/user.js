const express = require('express');

const userCtrl = require('../controllers/user');

const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.get('/login', userCtrl.login);
router.get('/all', auth, userCtrl.getAllMembres);
router.get('/search', auth, userCtrl.searchMembres);
router.get('/:idmembre', auth, userCtrl.getOneMembre);
router.put('/preferences', userCtrl.updatePreferences);
router.put('/update', auth, userCtrl.updateMembre);
router.put('/status', auth, userCtrl.setStatus);
router.delete('/:idmembre', auth, userCtrl.deleteMembre);

module.exports = router;
