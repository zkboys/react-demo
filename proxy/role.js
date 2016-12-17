const models = require('../models');
const RoleModel = models.Role;
/**
 * 根据id获取数据
 * @param id
 * @returns {*|Query}
 */
exports.getRoleById = function (id) {
    return RoleModel.findOne({_id: id}).lean();
};


exports.getRolesByPage = function (currentPage = 1, pageSize = 10, queries = {}) {
    const options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    const query = {};
    Object.keys(queries).forEach(v=> {
        query[v] = new RegExp(queries[v]);
    });
    query.is_deleted = false;
    return RoleModel.find(query, '', options).lean();
}

exports.getRolesCountByQuery = function (queries = {}) {
    const query = {};
    Object.keys(queries).forEach(v=> {
        query[v] = new RegExp(queries[v]);
    });

    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return RoleModel.count(query);
};

exports.getRoleByNameFromAllRoles = function (roleName) {
    return RoleModel.findOne({'name': new RegExp('^' + roleName + '$', "i")}).lean();
}

/**
 * 根据关键字，获取一组数据
 * @param query
 * @param opt
 * @returns {*|Query|T}
 */
exports.getRolesByQuery = function (query, opt) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return RoleModel.find(query, '', opt).lean();
};
/**
 * 修改
 * @param data
 * @returns {Query|*}
 */
exports.update = function (data) {
    RoleModel.update_at = new Date();
    return RoleModel.findOneAndUpdate({_id: data._id}, data).lean()
};

/**
 * 逻辑删除
 * @param id
 * @returns {Query|*}
 */
exports.delete = function (id) {
    return RoleModel.findOneAndUpdate({_id: id}, {is_deleted: true, update_at: new Date()}).lean()
};

/**
 * 新建
 * @param data
 * @returns {Promise|*}
 */
exports.addRole = function (data) {
    return new RoleModel(data).save();
};

