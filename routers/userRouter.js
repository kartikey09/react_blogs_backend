const express = require('express');
const userModel = require('../models/userModel');
const {
  getAllUsers,
  saveProfilePicture,
  getSelectedUsers,
  getUsersByName,
  saveBackgroundPicture,
  saveUserDetails,
} = require('../controllers/userController');

const userRoutes = express.Router();

userRoutes.route('/allusers').get(getAllUsers);

userRoutes.route('/selected-users').post(getSelectedUsers);

userRoutes.route('/save-profile-picture').post(saveProfilePicture);

userRoutes.route('/save-background-picture').post(saveBackgroundPicture);

userRoutes.route('/search/user-name/:userName').get(getUsersByName);

userRoutes.route('/save-details/user/:userId').post(saveUserDetails)

module.exports = userRoutes;
