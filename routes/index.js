var express = require('express');
var router = express.Router();

var sign = require('../controller/sign');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: '主页'
    });
});

// 登录

router.post('/api/signin', sign.login);


module.exports = router;