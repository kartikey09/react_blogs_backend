const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _JWT_TOKEN_ = require('../secret');

module.exports.protectRoute = async function protectRoute(req, res, next) {
  if (req) {
    try {
      let token = req.cookies.login_token;
      if (token !== undefined) {
        let pass = jwt.verify(token, _JWT_TOKEN_);
        if (pass) {
          next();
        } else {
          res.redirect('/login');
        }
      } else {
        res.redirect('/login');
      }
    } catch (e) {
      console.log(e.message);
    }
  } else {
    res.status(422).json({
      message: 'not a valid email address',
    });
  }
};

module.exports.authUserLogin = async function authUserLogin(req, res) {
  try {
    let user = req.body;
    let dbUser = await userModel.findOne({ email: user.email });
    if (dbUser) {
      let pass = await bcrypt.compare(user.password, dbUser.password);
      if (pass) {
        let token = jwt.sign({ payload: user['_id'] }, _JWT_TOKEN_);
        res.cookie('login_token', token, { secure: true, httpOnly: true });
        res.json({
          data: {
            _id: dbUser._id,
            email: dbUser.email,
            name: dbUser.name,
            profilePictureURL: dbUser.profilePictureURL,
          },
        });
      } else {
        console.log('wrong pass');
        res.status(401).send('invalid password');
      }
    } else {
      console.log('user does not exist');
      res.status(404).json({
        message: "User doesn't exists",
      });
    }
  } catch (err) {
    console.log('server error');
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.authUserSignup = async function authUserSignup(req, res) {
  try {
    let user = req.body;
    let doesUserExist = await userModel.findOne({ email: req.body.email });
    if (doesUserExist) {
      res.status(400).json({
        message: 'user exists',
      });
      return;
    }
    let savedUser = await userModel.create(user);

    if (savedUser) {
      let token = jwt.sign({ payload: savedUser['_id'] }, _JWT_TOKEN_);
      res.cookie('login_token', token, { httpOnly: true });
      res.json({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.name,

      });
    } else {
      res.status(500).json({
        message: 'unable to save user in database',
      });
      return;
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.authUserLogout = async function authUserLogout(req, res) {
  res.clearCookie('login_token');
  res.status(400).send({ message: 'user Logged Out' });
};
