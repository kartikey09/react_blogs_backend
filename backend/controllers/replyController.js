const { ObjectId } = require('mongodb');
const commentsModel = require('../models/commentModel');

module.exports.addReply = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });

    let reply_idx = -1;
    for (let i = 0; i < commentsSection.comments.length; i++) {
      if (
        JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
        JSON.stringify(ObjectId(req.body.commentId))
      ) {
        reply_idx = i;
        break;
      }
    }
    if (reply_idx > -1) {
      commentsSection.comments[reply_idx].replies.push({
        ownerId: req.body.ownerId,
        body: req.body.body,
        createdAt: Date.now(),
      });
      commentsSection.save();
    } else {
      res.status(404).send({ message: 'reply not found' });
    }
    res.status(200).send();
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.deleteReply = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });

    let reply_idx = -1;
    for (let i = 0; i < commentsSection.comments.length; i++) {
      if (
        JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
        JSON.stringify(ObjectId(req.body.commentId))
      ) {
        reply_idx = i;
        break;
      }
    }
    if (reply_idx > -1) {
      commentsSection.comments[reply_idx].replies = commentsSection.comments[
        reply_idx
      ].replies.filter((obj) =>
        JSON.stringify(ObjectId(obj._id)) ===
          JSON.stringify(ObjectId(req.body.replyId)) &&
        JSON.stringify(ObjectId(obj.ownerId)) ===
          JSON.stringify(ObjectId(req.body.ownerId))
          ? false
          : true
      );
      commentsSection.save();
    } else {
      res.status(404).send({ message: 'reply not found' });
    }
    res.status(200).send();
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.editReply = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });

    let reply_idx = -1;
    for (let i = 0; i < commentsSection.comments.length; i++) {
      if (
        JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
        JSON.stringify(ObjectId(req.body.commentId))
      ) {
        reply_idx = i;
        break;
      }
    }
    if (reply_idx > -1) {
      for (
        let i = 0;
        i < commentsSection.comments[reply_idx].replies.length;
        i++
      ) {
        if (
          JSON.stringify(
            ObjectId(commentsSection.comments[reply_idx].replies[i]._id)
          ) === JSON.stringify(ObjectId(req.body.replyId)) &&
          JSON.stringify(
            ObjectId(commentsSection.comments[reply_idx].replies[i].ownerId)
          ) === JSON.stringify(ObjectId(req.body.ownerId))
        ) {
          commentsSection.comments[reply_idx].replies[i].body = req.body.body;
          commentsSection.comments[reply_idx].replies[i].editedAt = Date.now();
          commentsSection.save();
          break;
        }
      }
    } else {
      res.status(404).send({ message: 'reply not found' });
    }
    res.status(200).send();
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.likeReply = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });

    let reply_idx = -1;
    for (let i = 0; i < commentsSection.comments.length; i++) {
      if (
        JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
        JSON.stringify(ObjectId(req.body.commentId))
      ) {
        reply_idx = i;
        break;
      }
    }
    if (reply_idx > -1) {
      for (
        let i = 0;
        i < commentsSection.comments[reply_idx].replies.length;
        i++
      ) {
        if (
          JSON.stringify(
            ObjectId(commentsSection.comments[reply_idx].replies[i]._id)
          ) === JSON.stringify(ObjectId(req.body.replyId))
        ) {
          let doesLikeExist = commentsSection.comments[reply_idx].replies[
            i
          ].likes.reduce((acc, obj, idx) => {
            return (
              acc ||
              JSON.stringify(ObjectId(obj.userId)) ===
                JSON.stringify(ObjectId(req.body.userId))
            );
          }, false);
          if (!doesLikeExist) {
            commentsSection.comments[reply_idx].replies[i].likes.push({
              userId: req.body.userId,
            });
            commentsSection.save();
          }
        }
      }
    } else {
      res.status(404).send({ message: 'reply not found' });
    }
    res.status(200).send();
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports.unlikeReply = async (req, res) => {
  try {
    const commentsSection = await commentsModel.findOne({
      postId: ObjectId(req.body.postId),
    });

    let reply_idx = -1;
    for (let i = 0; i < commentsSection.comments.length; i++) {
      if (
        JSON.stringify(ObjectId(commentsSection.comments[i]._id)) ===
        JSON.stringify(ObjectId(req.body.commentId))
      ) {
        reply_idx = i;
        break;
      }
    }
    if (reply_idx > -1) {
      for (
        let i = 0;
        i < commentsSection.comments[reply_idx].replies.length;
        i++
      ) {
        if (
          JSON.stringify(
            ObjectId(commentsSection.comments[reply_idx].replies[i]._id)
          ) === JSON.stringify(ObjectId(req.body.replyId))
        ) {
          commentsSection.comments[reply_idx].replies[i].likes =
            commentsSection.comments[reply_idx].replies[i].likes.filter(
              (obj, idx) =>
                JSON.stringify(ObjectId(obj.userId)) !==
                JSON.stringify(ObjectId(req.body.userId))
            );

          commentsSection.save();
        }
      }
    } else {
      res.status(404).send({ message: 'reply not found' });
    }
    res.status(200).send();
  } catch (err) {
    res.json({ message: err.message });
  }
};
