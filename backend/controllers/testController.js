const jwt = require('jsonwebtoken');

const setCookie = async (req, res, next)=>{
    let token = jwt.sign({payload : 'pass'}, 'sdfbdfjbsdjbfj');
    res.cookie('login_token', token, {httpOnly : true, secure : true});
    res.json({msg : 'cookie sent'})
}

const getCookie = async (req, res, next)=>{
    console.log(req);
}

module.exports = {setCookie, getCookie};