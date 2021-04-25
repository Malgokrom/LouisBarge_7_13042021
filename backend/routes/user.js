const express = require('express');

const userCtrl = require('../controllers/user');

const auth = require('../middlewares/auth');
const multerAvatar = require('../middlewares/multer-avatar');

const router = express.Router();

router.post('/signup', userCtrl.signup);
router.get('/login', userCtrl.login);
router.get('/all', auth, userCtrl.getAllMembres);
router.get('/search', auth, userCtrl.searchMembres);
router.get('/:idmembre', auth, userCtrl.getOneMembre);
router.put('/preferences', auth, userCtrl.updatePreferences);
router.put('/update/:iduser/:statususer', auth, multerAvatar, userCtrl.updateMembre);
router.put('/status', auth, userCtrl.setStatus);
router.delete('/:idmembre', auth, userCtrl.deleteMembre);

module.exports = router;
