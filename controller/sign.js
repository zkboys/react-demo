const _ = require('lodash');
var uuid = require('uuid');

const UserProxy = require('../proxy/user');
const RoleProxy = require('../proxy/role');
const MenuProxy = require('../proxy/menu');
const tools = require('../common/tools');
const authMiddleWare = require('../middlewares/auth');
const trim = _.trim;

exports.login = async function (req, res, next) {
    var loginname = trim(req.body.name);
    var pass = trim(req.body.pass);
    if (!loginname || !pass) {
        return res.sendError({
            message: '登录名或者密码不能为空',
            status: 422,
        });
    }
    try {
        const user = await UserProxy.getUserByLoginName(loginname);
        if (!user) {
            return res.sendError({
                message: '用户名或密码错误',
                status: 422,
            });
        }
        if (user.is_locked) {
            return res.sendError({
                message: '您已经被管理员屏蔽，如有疑问，请与管理员联系',
                status: 422,
            });
        }

        const passhash = user.pass;
        const isPassOk = await tools.bcompare(pass + user.salt, passhash);

        if (!isPassOk) {
            return res.sendError({
                message: '用户名或密码错误',
                status: 422,
            });
        }
        const refer = req.session._loginReferer || '/';

        // 清除上一个session
        req.session.destroy();
        authMiddleWare.gen_session(user, res);
        const role = await RoleProxy.getRoleById(user.role_id);
        if (role) {
            user.permissions = role.permissions;
        }

        var safeUSer = {
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
        const menus = await MenuProxy.getMenusByUser(user);

        res.send({refer: refer, user: safeUSer, menus: menus});
    } catch (error) {
        return res.sendError({
            error,
            message: '登录失败',
            status: 422,
        });
    }
};


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
        const existedUser = await UserProxy.getUserByLoginNameFromAllUsers(loginname);

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

        const savedUser = await UserProxy.newAndSave(user);
        return res.send(savedUser);
    } catch (error) {
        return res.sendError({
            error,
            message: '创建用户失败',
            status: 422,
        });
    }
};