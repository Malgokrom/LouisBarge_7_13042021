const express = require('express');

const messageCtrl = require('../controllers/message');

const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/post', auth, messageCtrl.post);
router.post('/tous', auth, messageCtrl.getAllPosts);
router.post('/get', auth, messageCtrl.get);

module.exports = router;
