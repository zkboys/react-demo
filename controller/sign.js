const uuid = require('uuid');
const controller = require('./controller-utils').controller;

const tools = require('../common/tools');
const config = require('../config');
const authMiddleWare = require('../middlewares/auth');

const userService = require('../service/user');

exports.login = controller(async function (req, res, next) {
    const loginName = req.body.name;
    const pass = req.body.pass;

    const user = await userService.getUserByLoginNameAndPass(loginName, pass);
    user.permissions = await userService.getUserPermissions(user);
    const menus = await userService.getUserMenus(user);
    const refer = req.session._loginReferer || '/';

    req.session.destroy();
    authMiddleWare.generateUserCookie(user, res);

    res.send({refer, user, menus});
});

exports.firstLogin = controller(async function (req, res, next) {
    const currentLoginUser = req.session.user;
    const userId = currentLoginUser._id;
    const oldPass = currentLoginUser.pass;
    const newPass = req.body.pass;
    const newPassRepeat = req.body.rePass;

    const updatedUser = await userService.updatePass(userId, oldPass, newPass, newPassRepeat);
    updatedUser.permissions = await userService.getUserPermissions(updatedUser);
    const menus = await userService.getUserMenus(updatedUser);

    req.session.destroy();
    authMiddleWare.generateUserCookie(updatedUser, res);

    res.send({refer: '/', user: updatedUser, menus: menus});

});

exports.signout = controller(function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {path: '/'});
    res.sendSuccess();
});