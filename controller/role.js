const controllerDecorator = require('./controller-decorator');
const RoleService = require('../service/role');

exports.getById = controllerDecorator(async function (req, res, next) {
    const roleId = req.params.id;
    const role = await RoleService.getRoleById(roleId);
    res.send(role);
});
exports.getByRoleNameFromAll = controllerDecorator(async function (req, res, next) {
    const roleName = req.params.name;
    const role = await RoleService.getRoleByNameFromAllRoles(roleName);
    res.send(role || false);
});
exports.getByPage = controllerDecorator(async function (req, res, next) {
    const currentPage = parseInt(req.query.currentPage, 10) || 1;
    const pageSize = Number(req.query.pageSize);
    const queries = {};
    ['name'].forEach(v => {
        const value = req.query[v];
        if (value) {
            queries[v] = value;
        }
    });

    const {roles: results, totalCount} = await RoleService.getRolesByPage(currentPage, pageSize, queries);

    res.send({
        results,
        totalCount,
    });
});

exports.delete = controllerDecorator(async function (req, res, next) {
    const roleId = req.body.id;
    await RoleService.deleteRoleById(roleId);
    res.sendSuccess();
});

exports.update = controllerDecorator(async function (req, res, next) {
    const role = req.body;
    const updatedRole = await RoleService.updateRole(role);
    res.send(updatedRole);
});

exports.addAndSave = controllerDecorator(async function (req, res, next) {
    const role = req.body;
    const savedRole = await RoleService.addRole(role);
    res.send(savedRole);
});
