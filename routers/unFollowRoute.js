const { unfollowRequest } = require('../controllers/unfollowController');

const unfollowRouter = require('express').Router();


unfollowRouter.route('/request/').post(unfollowRequest);

module.exports = unfollowRouter;