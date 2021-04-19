const express = require('express');

const commentCtrl = require('../controllers/comments');

const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/:idpost', auth, commentCtrl.getComments);
router.post('/:idpost', auth, commentCtrl.postComment);
router.delete('/:idcomment', auth, commentCtrl.deleteComment);

module.exports = router;
