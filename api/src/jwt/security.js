
var express = require('express'),
request = require('request'),
crypt = require('../kripto.js'),
router = express.Router(),
db = require('../db.js'),
jwt = require('./jwt'),
kripto = require('../kripto'),
fs = require('fs');

const login = {
/**
 * 
 * @param {any} req
 * @returns {Promise<Object|string>}  {error: string} | token: string
 */
    userLogin: function(user) {
        return new Promise((resolve, reject) => {
            if(user.username === kripto.decryptAdminPassword(user.password)){
                //TODO DB login dobar? 
                resolve(jwt.loginJwt(user));
            }
            // if(1){ ... }
            
            reject({error: "Invalid credentials"});
        })
    }
};

router.get('/test', function (req, res) {
    res.send({ "message": "OK"});
});
router.get('/test/auth', function (req, res) {
    res.send(req.user);
});

router.post('/login', function(req, res) {
    if(req.body && req.body.user) {
        login.userLogin(req.body.user).then(token => {
            res.send({token:token});
        }).catch(err => {
            res.status(401).send(err);
        })
    } else {
        res.status(401).send({ "error": "Invalid request!"});
    }
});


module.exports = {securityRouter: router, login: login};
