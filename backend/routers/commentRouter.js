const express = require('express');
const {
  createComment,
  getCommentsByPost,
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('../controllers/commentController');
const commentRouter = express.Router();

commentRouter.route('/add-comment').post(createComment);

commentRouter.route('/get-comments/postid/:postid').get(getCommentsByPost);

commentRouter.route('/edit-comment').patch(editComment);

commentRouter.route('/delete-comment').delete(deleteComment);

commentRouter.route('/like-comment').post(likeComment);

commentRouter.route('/unlike-comment').patch(unlikeComment);

module.exports = commentRouter;
