const { ObjectId } = require('mongodb');
const commentsModel = require('../models/commentModel');
const postsModel = require('../models/postModel');

module.exports.createComment = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });
    if (commentsSection && req.body.body.trim().length > 0) {
      commentsSection.comments.push({
        ownerId: req.body.ownerId,
        body: req.body.body,
        createdAt: Date.now()
      });
      commentsSection.save();
      post = await postsModel.findById(req.body.postId);
      post.commentsCount = commentsSection.comments.length;
      post.save();
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.getCommentsByPost = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.params.postid),
    });
    if (!commentsSection)
      res.status(404).json({ message: 'comments sections not found' });
    else res.json(commentsSection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.editComment = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });
    if (commentsSection) {
      for (let i = 0; i < commentsSection.comments.length; i++) {
        if (
          JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
            JSON.stringify(ObjectId(req.body.commentId)) &&
          JSON.stringify(ObjectId(req.body.ownerId)) ===
            JSON.stringify(ObjectId(commentsSection.comments[i].ownerId))
        ) {
          commentsSection.comments[i].body = req.body.body;
          commentsSection.comments[i].editedAt = Date.now();
        }
      }
      commentsSection.save();
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });
    if (commentsSection) {
      commentsSection.comments = commentsSection.comments.filter((obj) => {
        return !(
          JSON.stringify(ObjectId(obj._id)) ===
            JSON.stringify(ObjectId(req.body.commentId)) &&
          JSON.stringify(ObjectId(req.body.ownerId)) ===
            JSON.stringify(ObjectId(obj.ownerId))
        );
      });
      commentsSection.save();
      post = await postsModel.findById(req.body.postId);
      post.commentsCount = commentsSection.comments.length;
      post.save();
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.likeComment = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });
    if (commentsSection) {
      for (let i = 0; i < commentsSection.comments.length; i++) {
        if (
          JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
          JSON.stringify(ObjectId(req.body.commentId))
        ) {
          if (
            !commentsSection.comments[i].likes.reduce((acc, obj) => {
              console.log(commentsSection.comments[i].body);
              return (
                acc ||
                JSON.stringify(ObjectId(obj.userId)) ===
                  JSON.stringify(ObjectId(req.body.userId))
              );
            }, false)
          ) {
            commentsSection.comments[i].likes.push({
              userId: ObjectId(req.body.userId),
            });
            commentsSection.save();
          }
        }
      }
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.unlikeComment = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });
    if (commentsSection) {
      for (let i = 0; i < commentsSection.comments.length; i++) {
        if (
          JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
          JSON.stringify(ObjectId(req.body.commentId))
        ) {
          commentsSection.comments[i].likes = commentsSection.comments[i].likes.filter((obj) => {
            return JSON.stringify(ObjectId(obj.userId)) !== JSON.stringify(ObjectId(req.body.userId));
          });
          commentsSection.save();
        }
      }
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

