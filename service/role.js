const RoleProxy = require('../proxy/role');
const ServiceError = require('./service-error');
const message = require('../properties').errorMessages;

exports.getRoleById = async function (roleId) {
    return await RoleProxy.getRoleById(roleId);
};

exports.getRolesByPage = async function (currentPage = 1, pageSize = 10, queries = []) {
    const roles = await RoleProxy.getRolesByPage(currentPage, pageSize, queries);
    const totalCount = await RoleProxy.getRolesCountByQuery(queries);
    return {roles, totalCount}
};
exports.getRoleByNameFromAllRoles = async function (roleName) {
    return await RoleProxy.getRoleByNameFromAllRoles(roleName);
};

exports.deleteRoleById = async function (roleId) {
    return await RoleProxy.delete(roleId);
};

exports.updateRole = async function (role) {
    return await RoleProxy.update(role);
};

exports.addRole = async function (role) {
    if (!role.name) {
        throw new ServiceError(message.roleNameCanNotBeNull);
    }

    return await RoleProxy.addRole(role);
};