require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routers/userRouter');
const authRoutes = require('./routers/authRouter');
const testRouter = require('./routers/testRouter');
const postRoutes = require('./routers/postRouter');
const commentRouter = require('./routers/commentRouter');
const replyRouter = require('./routers/replyRouter');
const followRouter = require('./routers/followRouter');
const unfollowRouter = require('./routers/unFollowRoute');
const app = express();
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json(), cookieParser());
const port = 3001;
mongoose.set('strictQuery', false);
mongoose
  .connect(
    process.env.VITE_MONGO_URL
  )
  .then(() => {
    try {
      app.listen(port, () => console.log(`Server connected to port ${port}`));
    } catch (e) {
      console.log(e.message);
    }
  })
  .catch((e) => {
    console.log(`Invalid database connection, error message: ${e.message}`);
  });

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/test', testRouter);
app.use('/post', postRoutes);
app.use('/comment', commentRouter);
app.use('/reply', replyRouter);
app.use('/follow', followRouter);
app.use('/unfollow', unfollowRouter);

app.get('*', (req, res) => {
  res.send('Error 404 page not found :(');
});
