const userModel = require('../models/userModel');
const { ObjectId } = require('mongodb');

module.exports.unfollowRequest = async (req, res) => {
    try {
      const follower = await userModel.findById(req.query.fer);
      const followee = await userModel.findById(req.query.fee);
  
      console.log(followee, follower);
      if (!followee || !follower)
        res
          .status(404)
          .json({ message: 'either follower or followee does not exist' });
  
      if (follower && followee) {
            followee.requests = followee.requests.filter((obj)=>{
                return JSON.stringify(ObjectId(obj)) !=  JSON.stringify(ObjectId(follower._id))
            })

            followee.following = followee.following.filter((obj)=>{
                return JSON.stringify(ObjectId(obj)) !=  JSON.stringify(ObjectId(follower._id))
            })
            followee.save();
        }
        res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'internal server error' });
    }
};
  
