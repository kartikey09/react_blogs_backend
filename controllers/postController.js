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

module.exports.getPostsByUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    const posts = await postsModel.find({ _id: { $in: user.posts } });
    res.json({ data: posts });
  } catch (err) {
    res.status(500).json({ err });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.user._id);
    if (!user) res.status(400).json({ message: 'user does not exist' }); //400 === bad request
    try {
      let newPost;
      if (req.body.postType == 'poll') {
        newPost = {
          ownerId: user._id,
          body: req.body.body,
          pollData: [],
          postType: req.body.postType,
          createdAt: Date.now(),
        };
        for (let item of req.body.pollData) {
          newPost.pollData.push({ option: item, votes: [], percentage: 0 });
        }
      } else {
        newPost = {
          ownerId: user._id,
          body: req.body.body,
          postType: req.body.postType,
          createdAt: Date.now(),
        };
      }
      const createdPost = await postsModel.create(newPost);
      const postsComment = await commentsModel.create({
        postId: createdPost._id,
        createdAt: Date.now(),
      });
      user.posts.push(createdPost._id);
      await user.save();
      if (!createdPost || !postsComment)
        res
          .status(500)
          .json({ message: 'something went wrong, please try again later' });

      res.status(201).redirect('/login'); // 201 = created 202 = accepted
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
    await commentsModel.deleteOne({ postId: post._id });
    user.posts = user.posts.filter(
      (obj) => JSON.stringify(obj._id) !== JSON.stringify(post._id)
    );
    await user.save();

    res.status(202).send(); // 202 means that the request has not been acted upon but will likely succeed
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.likePost = async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if (
      post.likes.reduce(
        (acc, obj) =>
          acc &&
          JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id),
        true
      )
    ) {
      post.likes.push({ userId: ObjectId(req.body.user._id) });
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
    if (
      !post.likes.reduce(
        (acc, obj) =>
          acc &&
          JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id),
        true
      )
    ) {
      //!try to use save() instead of updateOne, updateMany,..etc because using save helps us do the prevalidation that is done before saving a document also save() keeps the record of history of the document and the no. of times its been updated represented by the __v field in the document
      const arr = post.likes.filter(
        (obj) =>
          JSON.stringify(obj.userId) !== JSON.stringify(req.body.user._id)
      );
      post.likes = [...arr];
      post.save();
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.votePoll = async (req, res) => {
  try {
    // console.log(req.query);
    const post = await postsModel.findById(req.query.postId);
    if (
      post.pollData[req.query.idx].votes.reduce(
        (acc, obj) =>
          acc &&
          JSON.stringify(obj.userId) !== JSON.stringify(req.query.userId),
        true
      )
    ) {
      post.pollData[req.query.idx].votes.push({
        userId: ObjectId(req.query.userId),
      });
      let count = post.pollData.reduce((acc, obj) => {
        // console.log(obj.votes.length);
        acc += obj.votes.length;
        return acc;
      }, 0);
      // console.log(count + typeof count)
      for (let pos in post.pollData) {
        post.pollData[pos].percentage = Math.round(
          (post.pollData[pos].votes.length / count) *
            100 *
            100
        ) / 100;
      }
      post.save().then(()=>{
        res.status(200).send();   
      })
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
