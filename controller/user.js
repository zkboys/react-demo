const _ = require('lodash');
var uuid = require('uuid');

const User = require('../proxy/user');
const tools = require('../common/tools');
const trim = _.trim;

exports.addAndSave = async function (req, res, next) {
    const loginname = trim(req.body.loginname);

    if (!loginname) {
        return res.sendError('登录名不能为空');
    }

    if (loginname.length < 2) {
        return res.sendError('登录名至少需要2个字符');
    }

    if (!tools.validateId(loginname)) {
        return res.sendError('登录名不合法');
    }

    const pass = loginname[0] + 123456; // 初始化密码

    try {
        const existedUser = await User.getUserByLoginNameFromAllUsers(loginname);

        if (existedUser) {
            return res.sendError('登录名已被使用');
        }

        const salt = uuid.v4();
        const passHash = await tools.bhash(pass + salt);

        const user = req.body;
        user.loginname = loginname;
        user.name = user.name || loginname;
        user.pass = passHash;
        user.salt = salt;

        const savedUser = await User.newAndSave(user);
        return res.send(savedUser);
    } catch (error) {
        return res.sendError({
            error,
            message: '创建用户失败',
            status: 422,
        });
    }
};