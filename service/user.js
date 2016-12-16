const _ = require('lodash');
const uuid = require('uuid');

const UserProxy = require('../proxy/user');
const RoleProxy = require('../proxy/role');
const MenuProxy = require('../proxy/menu');

const tools = require('../common/tools');
const ServiceError = require('./service-error');
const message = require('../properties').errorMessages;

const trim = _.trim;

exports.getUserByLoginNameAndPass = async function (loginName, pass) {
    loginName = trim(loginName);
    pass = trim(pass);

    if (!loginName || !pass) {
        throw new ServiceError(message.loginNamePassCanNotBeNull);
    }

    const user = await UserProxy.getUserByLoginName(loginName);

    if (!user) {
        throw new ServiceError(message.loginNamePassInvalid);
    }

    if (user.is_locked) {
        throw new ServiceError(message.userIsLocked);
    }

    const hashedPass = user.pass;
    const isPassOk = await tools.bcompare(pass + user.salt, hashedPass);

    if (!isPassOk) {
        throw new ServiceError(message.loginNamePassInvalid);
    }

    for (let p in user) {
        console.log(p);
    }
    return user;
};
/**
 * 更新用户密码
 * @param userId
 * @param oldPass
 * @param newPass
 * @param newPassRepeat
 * @returns {*|Object|Query|Query|*}
 */
exports.updatePass = async function (userId, oldPass, newPass, newPassRepeat) {
    newPass = trim(newPass);
    newPassRepeat = trim(newPassRepeat);
    oldPass = trim(oldPass);

    if (!oldPass) {
        throw new ServiceError(message.oldPassCanNotBeNull);
    }

    if (!newPass) {
        throw new ServiceError(message.newPassCanNotBeNull);
    }

    if (!newPassRepeat) {
        throw new ServiceError(message.newPassRepeatCanNotBeNull);
    }

    if (newPass !== newPassRepeat) {
        throw new ServiceError(message.towPassIsDifferent);
    }

    const user = await UserProxy.getUserById(userId);

    if (!user) {
        throw new ServiceError(message.userIsNotExisted);
    }

    const isOldPassValid = await tools.bcompare(oldPass + user.salt, user.pass);

    if (!isOldPassValid) {
        throw new ServiceError(message.oldPassInvalid);
    }

    user.pass = await tools.bhash(newPass + user.salt);
    user.is_first_login = false; // 修改密码之后，就不是第一次登录了

    return await UserProxy.update(user);

}

exports.resetUserPass = async function (userId) {
    const user = await UserProxy.getUserById(userId);

    if (!user) {
        throw new ServiceError(message.userIsNotExisted);
    }

    const initPass = user.loginname[0] + '123456';
    user.pass = await tools.bhash(initPass + user.salt);
    user.is_first_login = true;

    return await UserProxy.update(user);
}

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

exports.getUserById = async function (userId) {
    return await UserProxy.getUserById(userId);
};

exports.getByPage = async function (currentPage = 1, pageSize = 10, queries = []) {
    const users = await UserProxy.getUsersByPage(currentPage, pageSize, queries);
    const totalCount = await UserProxy.getUsersCountByQuery(queries);
    return {users, totalCount}
};

exports.getUserByLoginNameFromAllUsers = async function (loginName) {
    return await UserProxy.getUserByLoginNameFromAllUsers(loginName);
};

exports.deleteUserById = async function (userId) {
    return await UserProxy.delete(userId);
};

exports.toggleUserLock = async function (userId, isLocked) {
    if (isLocked) {
        return await UserProxy.unlock(userId);
    }
    return await UserProxy.lock(userId);
};

exports.updateUser = async function (user) {
    return await UserProxy.update(user);
};

exports.addAndSave = async function (user) {
    const loginName = trim(user.loginname);

    if (!loginName) {
        throw new ServiceError(message.loginNameCanNotBeNull);
    }

    if (loginName.length < 2) {
        throw new ServiceError(message.loginNameLengthInvalid);
    }

    if (!tools.validateId(loginName)) {
        throw new ServiceError(message.loginNameInvalid);
    }

    const initPass = loginName[0] + 123456;
    const existedUser = await UserProxy.getUserByLoginNameFromAllUsers(loginName);

    if (existedUser) {
        throw new ServiceError(message.loginNameIsUsed);
    }

    const salt = uuid.v4();
    const initHashedPass = await tools.bhash(initPass + salt);

    user.name = user.name || user.loginname;
    user.pass = initHashedPass;
    user.salt = salt;

    return await UserProxy.newAndSave(user);
}






















