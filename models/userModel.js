const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const __DBURL =
  'mongodb+srv://admin:admin123@mastercluster.dxy63ez.mongodb.net/General?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(__DBURL, () => console.log('User DB connected'));

// const userDetailsSchema = mongoose.Schema({
  // country: {
  //   type: String,
  //   required: false,
  //   unique: false,
  //   default: '',
  // },
  // state: {
  //   type: String,
  //   required: false,
  //   unique: false,
  //   default: '',
  // },
  // bio: {
  //   type: String,
  //   required: false,
  //   maxLength: [90, 'bio cannot contain more than 90 characters'],
  //   default: '',
  // },
  // education: {
  //   type: String,
  //   required: false,
  //   maxLength: [90, 'education details cannot contain more than 90 characters'],
  //   default: '',
  // },
// });

// const userDetailsModel = mongoose.model('userDetail', userDetailsSchema);

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
  backgroundPictureURL: {
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
  details: { 
    country: {
      type: String,
      required: false,
      unique: false,
      default: null,
    },
    state: {
      type: String,
      required: false,
      unique: false,
      default: null,
    },
    bio: {
      type: String,
      required: false,
      maxLength: [90, 'bio cannot contain more than 90 characters'],
      default: null,
    },
    education: {
      type: String,
      required: false,
      maxLength: [90, 'education details cannot contain more than 90 characters'],
      default: null,
    },
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
  requests: [
    {
      type: ObjectID,
      required: false,
    },
  ],
  posts: [
    {
      type: ObjectID,
      unique: true,
    },
  ],
});

// userSchema.pre('save', async function () {
//   let hashedPassword = await bcrypt.hash(this.password, 10);
//   this.password = hashedPassword;
// });

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
