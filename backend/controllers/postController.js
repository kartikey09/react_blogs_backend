const postsModel = require('../models/postModel');
const userModel = require('../models/userModel');
const commentsModel = require('../models/commentModel');
const { ObjectId } = require('mongodb');

module.exports.getAllPosts = async (req, res) => {
  try {
    const allPosts = await postsModel.find();
    res.status(200).json({
      data: allPosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.user._id);
    if (!user) res.status(400).json({ message: 'user does not exist' }); //400 === bad request
    try {
      newPost = {
        ownerId: user._id,
        body: req.body.body,
        createdAt: Date.now()
      };
      const createdPost = await postsModel.create(newPost);
      const postsComment = await commentsModel.create({
        postId: createdPost._id,
        createdAt: Date.now()
      });
      if (!createdPost || !postsComment)
        res
          .status(500)
          .json({ message: 'something went wrong, please try again later' });

      res.status(201).redirect('/login');   // 201 = created 202 = accepted
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};

module.exports.editPost = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.user._id);
    const post = await postsModel.findById(req.body.post._id);

    if (
      !user ||
      !post ||
      JSON.stringify(user._id) !== JSON.stringify(post.ownerId)
    )
      res.status(400).json({ message: 'Bad request, data discrepancy' });

    const updatedPost = await postsModel.findOneAndUpdate(
      { _id: post._id },
      { body: req.body.body, editedAt: Date.now() },
      { new: true }
    );
    if (!updatedPost)
      res.status(500).json({
        message:
          'something went wrong while updating your post, please try again later',
      });
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.user._id);
    const post = await postsModel.findById(req.body.post._id);
    if (
      !user ||
      !post ||
      JSON.stringify(user._id) !== JSON.stringify(post.ownerId)
    ) {
      res.status(400).json({ message: 'Bad request, data discrepancy' });
    }
    await postsModel.deleteOne({ _id: post._id });
    await commentsModel.deleteOne({postId: post._id});

    res.status(202).send(); // 202 means that the request has not been acted upon but will likely succeed
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if(post.likes.reduce((acc, obj)=> acc && (JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id)), true)){
      post.likes.push({userId:ObjectId(req.body.user._id)});
      post.save();
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.unlikePost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if(!post.likes.reduce((acc, obj)=> acc && (JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id)), true)){   //!try to use save() instead of updateOne, updateMany,..etc because using save helps us do the prevalidation that is done before saving a document also save() keeps the record of history of the document and the no. of times its been updated represented by the __v field in the document
      const arr = post.likes.filter(obj=> JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id))
      post.likes = [...arr];
      post.save();
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
