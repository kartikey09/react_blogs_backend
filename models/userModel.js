const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
// const __DBURL =
//   'mongodb+srv://admin:admin123@mastercluster.dxy63ez.mongodb.net/General?retryWrites=true&w=majority';
// mongoose.set('strictQuery', false);
// mongoose.connect(__DBURL, () => console.log('User DB connected'));

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePictureURL: {
    type: String,
    default: null,
    required: false,
    unique: false,
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  followers: [
    {
      type: ObjectID,
      required: false,
    },
  ],
  following: [
    {
      type: ObjectID,
      required: false,
    },
  ],
  posts: [
    {
      type: ObjectID,
    },
  ],
});

userSchema.pre('save', async function () {
  let hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
