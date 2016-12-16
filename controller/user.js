const controller = require('./controller-utils').controller;
const userService = require('../service/user');

exports.addAndSave = controller(async function (req, res, next) {
    const user = req.body;
    const savedUser = await userService.addAndSave(user);
    res.send(savedUser);
});

exports.getById = controller(async function (req, res, next) {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.send(user);
});

exports.getByPage = controller(async function (req, res, next) {
    const currentPage = parseInt(req.query.currentPage, 10) || 1;
    const pageSize = Number(req.query.pageSize);
    const queries = {};
    ['loginname', 'name', 'mobile'].forEach(v => {
        const value = req.query[v];
        if (value) {
            queries[v] = value;
        }
    });

    const {users: results, totalCount} = await userService.getByPage(currentPage, pageSize, queries);

    res.send({
        results,
        totalCount,
    });
});

exports.getByLoginNameFromAll = controller(async function (req, res, next) {
    const loginName = req.params.loginname;
    const user = await userService.getUserByLoginNameFromAllUsers(loginName);
    res.send(user || false);
});

exports.delete = controller(async function (req, res, next) {
    const id = req.body.id;
    await userService.deleteUserById(id);
    res.sendSuccess();
});

exports.toggleLock = controller(async function (req, res, next) {
    const id = req.body.id;
    const isLocked = req.body.isLocked;
    const user = await userService.toggleUserLock(id, isLocked);
    res.send(user);
});

exports.update = controller(async function (req, res, next) {
    const user = req.body;
    const updatedUser = await userService.updateUser(user);
    res.send(updatedUser);
});

exports.updatePass = controller(async function (req, res, next) {
    const newPass = req.body.pass;
    const newPassRepeat = req.body.rePass;
    const oldPass = req.body.orPass;
    const currentLoginUser = req.session.user;
    const userId = currentLoginUser._id;

    await userService.updatePass(userId, oldPass, newPass, newPassRepeat);
    res.sendSuccess();
});

exports.resetPass = controller(async function (req, res, next) {
    const userId = req.body.id;
    await userService.resetUserPass(userId);
    res.sendSuccess();
});
