const _ = require('lodash');
const uuid = require('uuid');

const UserProxy = require('../proxy/user');
const RoleProxy = require('../proxy/role');
const MenuProxy = require('../proxy/menu');
const tools = require('../common/tools');
const config = require('../config');
const authMiddleWare = require('../middlewares/auth');
const trim = _.trim;

const userService = require('../service/user');


exports.login = async function (req, res, next) {
    const loginName = req.body.name;
    const pass = req.body.pass;

    try {
        const user = await userService.login(loginName, pass);
        user.permissions = await userService.getUserPermissions(user);
        const menus = await userService.getUserMenus(user);
        const refer = req.session._loginReferer || '/';

        // 清除上一个session
        req.session.destroy();
        authMiddleWare.generateUserCookie(user, res);

        res.send({refer, user, menus});
    } catch (error) {
        res.sendError(error)
    }
};

exports.firstLogin = async function (req, res, next) {
    const currentLoginUser = req.session.user;
    const pass = trim(req.body.pass);
    const rePass = trim(req.body.rePass);
    if (!pass) {
        return res.sendError({
            status: 422,
            message: '新密码不能为空',
        });
    }
    if (!rePass) {
        return res.sendError({
            status: 422,
            message: '确认密新码不能为空',
        });
    }
    if (pass !== rePass) {
        return res.sendError({
            status: 422,
            message: '两次输入密码不一致',
        });
    }
    try {
        const hashedPass = await tools.bhash(pass + currentLoginUser.salt);
        currentLoginUser.pass = hashedPass;
        currentLoginUser.is_first_login = false;

        const updatedUser = await UserProxy.update(currentLoginUser);
        // 清除上一个用户的session
        req.session.destroy();
        // store session cookie
        authMiddleWare.generateUserCookie(updatedUser, res);

        const role = await RoleProxy.getRoleById(updatedUser.role_id);

        if (role) {
            updatedUser.permissions = role.permissions;
        }

        const safeUser = getSafeUser(updatedUser);
        const menus = await MenuProxy.getMenusByUser(updatedUser);

        res.send({refer: '/', user: safeUser, menus: menus});

    } catch (error) {
        return res.sendError({
            error,
            message: '操作失败',
        });
    }
};

exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.sendSuccess();
};

function getSafeUser(user) {
    return {
        _id: user._id,
        permissions: user.permissions || [],
        name: user.name,
        loginname: user.loginname,
        email: user.email,
        avatar: user.avatar,
        mobile: user.mobile,
        gender: user.gender,
        is_first_login: user.is_first_login,
    };
}