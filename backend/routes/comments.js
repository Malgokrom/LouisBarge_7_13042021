const express = require('express');

const commentCtrl = require('../controllers/comments');

const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/post', auth, commentCtrl.post);
router.post('/get', auth, commentCtrl.get);
router.post('/delete', auth, commentCtrl.deleteComment);

module.exports = router;
