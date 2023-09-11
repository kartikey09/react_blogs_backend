const express = require('express');
const { protectRoute } = require('../controllers/authController');
const {
  createPost,
  getAllPosts,
  editPost,
  deletePost,
  likePost,
  unlikePost,
} = require('../controllers/postController');
const postRoutes = express.Router();

// postRoutes.use(protectRoute);
postRoutes.route('/create-post').post(createPost);

postRoutes.route('/get-all-posts').get(getAllPosts);

postRoutes.route('/edit-post').patch(editPost);

postRoutes.route('/delete-post').delete(deletePost);

postRoutes.route('/like/id/:id').post(likePost);

postRoutes.route('/unlike/id/:id').post(unlikePost);

module.exports = postRoutes;
