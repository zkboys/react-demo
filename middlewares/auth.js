var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');
var UserProxy = require('../proxy').User;

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.user._id) {
        return res.status(403).send('需要登录！');
    }
    next();
};

exports.blockUser = function () {
    return function (req, res, next) {
        if (req.path === '/signout') {
            return next();
        }

        if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
            return res.status(403).send('您已被管理员屏蔽了。有疑问请联系 @alsotang。');
        }
        next();
    };
};

/**
 * 生成cookie
 * @param user
 * @param res
 */
function gen_session(user, res) {
    var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;

// 验证用户是否登录
exports.authUser = function (req, res, next) {

    // Ensure current_user always has defined.
    res.locals.current_user = null;

    // debug模式下创建虚拟用户
    if (config.debug && req.cookies['mock_user']) {
        var mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = new UserModel(mockUser);
        return next();
    }

    if (req.session.user) {
        res.locals.current_user = req.session.user = new UserModel(req.session.user);
        return next();
    } else {
        var auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }
        var auth = auth_token.split('$$$$');
        var user_id = auth[0];
        UserProxy.getUserById(user_id, (error, user) => {
            if (error) {
                return next(error);
            }
            res.locals.current_user = req.session.user = new UserModel(user);
            return next();
        });
    }
};
