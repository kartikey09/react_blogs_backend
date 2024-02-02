const userModel = require('../models/userModel');
const { ObjectId } = require('mongodb');

module.exports.followRequest = async (req, res) => {
  try {
    const follower = await userModel.findById(req.query.fer);
    const followee = await userModel.findById(req.query.fee);

    console.log(followee, follower);
    if (!followee || !follower)
      res
        .status(404)
        .json({ message: 'either follower or followee does not exist' });

    if (follower && followee) {
      if (
        !followee.requests.reduce((acc, obj) => {
          return (
            acc ||
            JSON.stringify(ObjectId(obj)) ==
              JSON.stringify(ObjectId(follower._id))
          );
        }, false)
      ) {
        followee.requests.push(follower);
        followee.save();
      }
      res.status(200).send();
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'internal server error' });
  }
};

module.exports.followRequestAccepted = async (req, res) => {
  try {
    const follower = await userModel.findById(req.query.fer);
    const followee = await userModel.findById(req.query.fee);

    // console.log(followee, follower);
    if (!followee || !follower)
      res.status(404).json({ message: 'either follower or the person to be followed does not exist'});
    else if(!followee.requests.reduce((acc, obj) => acc || JSON.stringify(ObjectId(obj)) == JSON.stringify(ObjectId(follower._id)), false))
        res.status(400).json({message: 'follower\'s follow request does not exist'});
    else if(followee.followers.reduce((acc, uid) => acc || JSON.stringify(ObjectId(uid)) == JSON.stringify(ObjectId(follower._id)), false))
        res.status(400).json({message: 'follower already follows this person'});
    else if(!follower || !followee) {
        followee.requests = followee.requests.filter((uid) => JSON.stringify(ObjectId(uid)) != JSON.stringify(ObjectId(follower._id)));
        followee.followers.push(follower._id);
        followee.save();
        res.status(200);
    }
    else
        res.status(500);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'internal server error' });
  }
};
