var config = require('../config');
var UserProxy = require('../proxy/User');
var RoleProxy = require('../proxy/Role');

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    if (!req.session || !req.session.user || !req.session.user._id) {

        req.session && (req.session._loginReferer = req.headers.referer);
        if (req.path.indexOf('/api') === 0) {
            return res.sendError({
                status: 401,
                message: '需要登录',
            });
        }
        return res.redirect('/signin');
    }
    next();
};

exports.blockUser = function () {
    return function (req, res, next) {
        if (req.path === '/signout') {
            return next();
        }

        if (req.session && req.session.user && req.session.user.is_block && req.method !== 'GET') {
            return res.sendError({
                status: 403,
                message: '您已被管理员屏蔽了。有疑问请联系管理员',
            });
        }
        next();
    };
};

/**
 * 生成cookie
 * @param user
 * @param res
 */
exports.generateUserCookie = function (user, res) {
    var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
};

// 获取用户
exports.authUser = async function (req, res, next) {
    // Ensure current_user always has defined.
    res.locals.current_user = null;

    // debug模式下创建虚拟用户
    if (config.debug && req.cookies['mock_user']) {
        var mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = mockUser;
        return next();
    }
    // session 过期
    if (req.session.lastVisitAt && (new Date().getTime() - req.session.lastVisitAt >= config.session_time_out)) {
        // req.session.destroy(); // destroy之后无法使用req.session._loginReferer = req.path;
        req.session.user = null;
        res.clearCookie(config.auth_cookie_name, {path: '/'});
        return next();
    }

    if (req.session && req.session.user) {
        req.session.lastVisitAt = new Date().getTime();
        res.locals.current_user = req.session.user;
        return next();
    }

    var auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
        return next();
    }
    var auth = auth_token.split('$$$$');
    var user_id = auth[0];
    if (!user_id || user_id === 'undefined') {
        return next();
    }
    try {
        const user = await UserProxy.getUserById(user_id);
        const role = await RoleProxy.getRoleById(user.role_id);
        if (role) {
            user.permissions = role.permissions;
        }
        const sessionUser = {
            _id: user._id,
            name: user.name,
            loginname: user.loginname,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            position: user.position,
            org_key: user.org_key,
            role_id: user.role_id,
            pass: user.pass,
            salt: user.salt,
            update_at: user.update_at,
            create_at: user.create_at,
            is_deleted: user.is_deleted,
            is_locked: user.is_locked,
            is_first_login: user.is_first_login,
            permissions: user.permissions,
        };

        req.session.lastVisitAt = new Date().getTime();
        res.locals.current_user = req.session.user = sessionUser;
        return next();
    } catch (error) {
        return next(error);
    }
};
