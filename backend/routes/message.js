const express = require('express');

const messageCtrl = require('../controllers/message');

const auth = require('../middlewares/auth');
const multerPost = require('../middlewares/multer-post');

const router = express.Router();

router.post('/post/:iduser/:statususer', auth, multerPost, messageCtrl.addPost);
router.get('/all', auth, messageCtrl.getAllPosts);
router.get('/search', auth, messageCtrl.searchPosts);
router.delete('/:idpost', auth, messageCtrl.deletePost);

module.exports = router;
