const { followRequest, followRequestAccepted } = require('../controllers/followController');

const followRouter = require('express').Router();

followRouter.route('/request/').post(followRequest);

followRouter.route('/accept-request/').post(followRequestAccepted);

module.exports = followRouter;