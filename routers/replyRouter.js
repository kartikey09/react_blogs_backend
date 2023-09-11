const express = require('express');
const { addReply, deleteReply, editReply, likeReply, unlikeReply } = require('../controllers/replyController');
const replyRouter = express.Router();

replyRouter.route('/add-reply').post(addReply);

replyRouter.route('/delete-reply').delete(deleteReply);

replyRouter.route('/edit-reply').patch(editReply);

replyRouter.route('/like-reply').post(likeReply);

replyRouter.route('/unlike-reply').patch(unlikeReply);

module.exports = replyRouter;