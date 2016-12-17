const controllerDecorator = require('./controller-decorator');
const UserService = require('../service/user');

exports.addAndSave = controllerDecorator(async function (req, res, next) {
    const user = req.body;
    const savedUser = await UserService.addUser(user);
    res.send(savedUser);
});

exports.getById = controllerDecorator(async function (req, res, next) {
    const userId = req.params.id;
    const user = await UserService.getUserById(userId);
    res.send(user);
});

exports.getByPage = controllerDecorator(async function (req, res, next) {
    const currentPage = parseInt(req.query.currentPage, 10) || 1;
    const pageSize = Number(req.query.pageSize);
    const queries = {};
    ['loginname', 'name', 'mobile'].forEach(v => {
        const value = req.query[v];
        if (value) {
            queries[v] = value;
        }
    });

    const {users: results, totalCount} = await UserService.getByPage(currentPage, pageSize, queries);

    res.send({
        results,
        totalCount,
    });
});

exports.getByLoginNameFromAll = controllerDecorator(async function (req, res, next) {
    const loginName = req.params.loginname;
    const user = await UserService.getUserByLoginNameFromAllUsers(loginName);
    res.send(user || false);
});

exports.delete = controllerDecorator(async function (req, res, next) {
    const id = req.body.id;
    await UserService.deleteUserById(id);
    res.sendSuccess();
});

exports.toggleLock = controllerDecorator(async function (req, res, next) {
    const id = req.body.id;
    const isLocked = req.body.isLocked;
    const user = await UserService.toggleUserLock(id, isLocked);
    res.send(user);
});

exports.update = controllerDecorator(async function (req, res, next) {
    const user = req.body;
    const updatedUser = await UserService.updateUser(user);
    res.send(updatedUser);
});

exports.updatePass = controllerDecorator(async function (req, res, next) {
    const newPass = req.body.pass;
    const newPassRepeat = req.body.rePass;
    const oldPass = req.body.orPass;
    const currentLoginUser = req.session.user;
    const userId = currentLoginUser._id;

    await UserService.updatePass(userId, oldPass, newPass, newPassRepeat);
    res.sendSuccess();
});

exports.resetPass = controllerDecorator(async function (req, res, next) {
    const userId = req.body.id;
    await UserService.resetUserPass(userId);
    res.sendSuccess();
});
