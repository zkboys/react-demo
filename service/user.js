const _ = require('lodash');
const uuid = require('uuid');

const UserProxy = require('../proxy/user');
const RoleProxy = require('../proxy/role');
const MenuProxy = require('../proxy/menu');

const tools = require('../common/tools');

const trim = _.trim;


exports.login = async function (loginName, pass) {
    loginName = trim(loginName);
    pass = trim(pass);

    if (!loginName || !pass) {
        throw new Error('登录名或者密码不能为空');
    }

    const user = await UserProxy.getUserByLoginName(loginName);

    if (!user) {
        throw new Error('用户名或密码错误');
    }

    if (user.is_locked) {
        throw new Error('您已经被管理员屏蔽，如有疑问，请与管理员联系');
    }

    const hashedPass = user.pass;
    const isPassOk = await tools.bcompare(pass + user.salt, hashedPass);

    if (!isPassOk) {
        throw new Error('用户名或密码错误');
    }
    
    return getSafeUser(user);
};

exports.getUserPermissions = async function (user) {
    const role = await RoleProxy.getRoleById(user.role_id);

    if (role) {
        return role.permissions;
    }

    return null
};

exports.getUserMenus = async function (user) {
    return await MenuProxy.getMenusByUser(user);
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