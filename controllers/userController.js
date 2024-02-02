require('dotenv').config();
const userModel = require('../models/userModel');
const { ObjectId } = require('mongodb');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3_instance = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
});

module.exports.getAllUsers = async function getAllUsers(req, res) {
  try {
    let allUsers = await userModel.find();
    if (allUsers) {
      res.json({
        user: allUsers,
      });
    } else {
      res.json({
        message: 'no users found',
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.getSelectedUsers = async function getSelectedUsers(req, res) {
  try {
    const users = req.body;
    data = await userModel
      .find({
        _id: {
          $in: [...users.map((id) => ObjectId(id))],
        },
      })
      .clone().lean();
      userData = data.map(obj=>{delete obj.password; return obj});
    return res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3: s3_instance,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image${Date.now()}.jpeg`);
      },
    }),
  });

module.exports.saveProfilePicture = async function saveProfilePicture(
  req,
  res,
  next
) {
  if (req !== undefined && req.body !== undefined && req.body.image === null) {
    console.log(req.body.id);
    const curr_user = await userModel.findById(req.body.id);
    await curr_user.updateOne({ profilePictureURL: null });
    res.status(200).json({ data: null });
  } else {
    const uploadSingle = upload('profile-pictures-db').single('croppedImage');
    uploadSingle(req, res, async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      userModel
        .findById(req.body.id)
        .then((response) => {
          return response.updateOne({ profilePictureURL: req.file.location });
        })
        .then(() => {
          res.status(200).json({ data: req.file.location });
        })
        .catch((err) => {
          res.status(500).json({ err });
        });
    });
  }
};

module.exports.saveBackgroundPicture = async function saveBackgroundPicture(
  req,
  res,
  next
) {
  if (req !== undefined && req.body !== undefined && req.body.image === null) {
    console.log(req.body.id);
    const curr_user = await userModel.findById(req.body.id);
    await curr_user.updateOne({ backgroundPictureURL: null });
    res.status(200).json({ data: null });
  } else {
    const uploadSingle = upload('profile-pictures-db').single('croppedImage');
    uploadSingle(req, res, async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(400).json({ success: false, message: err.message });
      }
      userModel
        .findById(req.body.id)
        .then((response) => {
          return response.updateOne({ backgroundPictureURL: req.file.location });
        })
        .then(() => {
          res.status(200).json({ data: req.file.location });
        })
        .catch((err) => {
          res.status(500).json({ err });
        });
    });
  }
};

module.exports.getUsersByName = async function getUsersByName(req, res) {
  const userName = req.params.userName;
  try {
    await userModel
      .find({ name: new RegExp('^' + userName, 'i') })
      .lean()
      .then((response) => {
        let response_new = response.map((obj) => {
          delete obj.password;
          return obj;
        })
        res.send({ data: response_new });
      });
  } catch (error) {
    res.status(500).send({ error });
  }
};

module.exports.saveUserDetails = async function(req, res){
  try{
    console.log(req.body);
    const user = await userModel.findById(req.params.userId);
    if(user){
      for(let i = 0; i < Object.keys(req.body).length; i++){
        user.details[Object.keys(req.body)[i]] = req.body[Object.keys(req.body)[i]];
      }
      user.save();
      res.status(200).send()
    }else {
      res.status(404).json({msg: 'user not found'});
    }
  }catch(e){
    res.status(500).json({error: e.message})
  }
}