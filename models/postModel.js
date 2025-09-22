const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const __DBURL =
  'mongodb+srv://admin:admin123@mastercluster.dxy63ez.mongodb.net/General?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);
mongoose.connect(__DBURL, () => console.log('Post DB connected'));

const postsSchema = mongoose.Schema({
  ownerId: {
    type: ObjectID,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: {
    type: Date,
    default: null,
  },
  body: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return !v.split(' ').length <= 0;
      },
    },
    maxLength: [3000, 'body length more than 3000 characters'],
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  likes: [
    {
      userId: { type: ObjectID },
    },
  ],
  reposts: [
    {
      userId: { type: ObjectID },
    },
  ],
});

const postsModel = mongoose.model('posts', postsSchema);
module.exports = postsModel;

//? the post collection will have all the posts and the ids of all who have liked it and its main Body, will add the images features later on.
//? for the comments we'll have the comments stored in a separate collection, a document of this collection will have the id of the parent post and if
//? this comment has any reply it'll be listed there below th comment.
