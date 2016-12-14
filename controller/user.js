const _ = require('lodash');
var uuid = require('uuid');

const UserProxy = require('../proxy/user');
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

exports.getById = async function (req, res, next) {
    const id = req.params.id;
    try {
        const user = await  UserProxy.getUserById(id);
        res.send(user);
    } catch (error) {
        res.sendError({
            error,
            message: '获取用户失败'
        });
    }
}

exports.getByPage = async function (req, res, next) {
    const currentPage = parseInt(req.query.currentPage, 10) || 1;
    const pageSize = Number(req.query.pageSize);
    const options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    const query = {};
    // 如下字段进行模糊查询。
    ['loginname', 'name', 'mobile'].forEach(function (v) {
        const value = req.query[v];
        if (value) {
            query[v] = new RegExp(value);
        }
    });

    try {
        const results = await UserProxy.getUsersByQuery(query, options);
        const totalCount = await UserProxy.getUsersCountByQuery(query);
        res.send({
            results,
            totalCount,
        });
    } catch (error) {
        res.sendError({
            error,
            message: '获取人员信息失败',
        });
    }
};

exports.getByLoginNameFromAll = async function (req, res, next) {
    const loginName = req.params.loginname;

    try {
        const user = await UserProxy.getUserByLoginNameFromAllUsers(loginName);
        res.send(user || false);
    } catch (error) {
        res.sendError({
            error,
            message: '获取人员信息失败',
        });
    }
};

exports.delete = async function (req, res, next) {
    const id = req.body.id;

    try {
        await UserProxy.delete(id);
        res.sendSuccess();
    } catch (error) {
        res.sendError({
            error,
            message: '删除人员信息失败',
        });
    }
};

exports.toggleLock = async function (req, res, next) {
    const id = req.body.id;
    const isLocked = req.body.isLocked;

    if (isLocked) {
        try {
            const user = await UserProxy.unlock(id);
            res.send(user);
        } catch (error) {
            res.sendError({
                error,
                message: '解锁用户失败',
            });
        }
    } else {
        try {
            const user = await UserProxy.lock(id);
            res.send(user);
        } catch (error) {
            res.sendError({
                error,
                message: '锁定用户失败',
            });
        }
    }
};

exports.update = async function (req, res, next) {
    const user = req.body;

    try {
        const updatedUser = await UserProxy.update(user);
        res.send(updatedUser);
    } catch (error) {
        res.sendError({
            error,
            message: '修改用户失败',
        });
    }
};
exports.updatePass = async function (req, res, next) {
    const pass = trim(req.body.pass) || '';
    const rePass = trim(req.body.rePass) || '';
    const orPass = trim(req.body.orPass) || '';
    const currentLoginUser = req.session.user;

    if (pass !== rePass) {
        return res.sendError('新密码与确认密码不一致');
    }

    try {
        const user = await UserProxy.getUserById(currentLoginUser._id);

        if (!user) {
            return res.sendError('修改密码失败');
        }

        const isSamePass = await tools.bcompare(orPass + user.salt, user.pass);

        if (!isSamePass) {
            return res.sendError('原密码错误');
        }

        user.pass = await tools.bhash(pass + user.salt);
        user.save();
        return res.sendSuccess();
    } catch (error) {
        res.sendError({
            error,
            message: '修改密码失败',
        });
    }
};

exports.resetPass = async function (req, res, next) {
    var userId = req.body.id;
    try {
        const user = await UserProxy.getUserById(userId);
        if (!user) {
            return res.sendError('重置密码失败');
        }

        const pass = user.loginname[0] + '123456';
        user.pass = await tools.bhash(pass + user.salt);
        user.is_first_login = true;

        user.save();
        res.sendSuccess();

    } catch (error) {
        res.sendError({
            error,
            message: '重置密码失败',
        })
    }
};
