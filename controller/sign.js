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
        const user = await userService.getUserByLoginNameAndPass(loginName, pass);
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
    const userId = currentLoginUser._id;
    const oldPass = currentLoginUser.pass;
    const newPass = req.body.pass;
    const newPassRepeat = req.body.rePass;

    try {
        const updatedUser = await userService.updatePass(userId, oldPass, newPass, newPassRepeat);
        updatedUser.permissions = await userService.getUserPermissions(updatedUser);
        const menus = await userService.getUserMenus(updatedUser);

        // 清除上一个用户的session
        req.session.destroy();
        authMiddleWare.generateUserCookie(updatedUser, res);

        res.send({refer: '/', user: updatedUser, menus: menus});

    } catch (error) {
        res.sendError(error);
    }
};

exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.sendSuccess();
};