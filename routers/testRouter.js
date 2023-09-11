const{ getCookie, setCookie } = require('../controllers/testController');

const testRouter = require('express').Router();

testRouter.route('/set-cookie')
    .get(setCookie);

testRouter.route('/get-cookie')
    .get(getCookie);

module.exports = testRouter;