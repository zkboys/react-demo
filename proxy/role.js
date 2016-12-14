var models = require('../models');
var RoleModel = models.Role;
/**
 * 根据id获取数据
 * @param id
 * @returns {*|Query}
 */
exports.getRoleById = function (id) {
    return RoleModel.findOne({_id: id});
};

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
    return RoleModel.find(query, '', opt);
};
/**
 * 根据关键字，获取数量
 * @param query
 * @returns {Query|*}
 */
exports.getRolesCountByQuery = function (query) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return RoleModel.count(query);
};

/**
 * 修改
 * @param data
 * @returns {Query|*}
 */
exports.update = function (data) {
    RoleModel.update_at = new Date();
    return RoleModel.findOneAndUpdate({_id: data._id}, data)
};

/**
 * 逻辑删除
 * @param id
 * @returns {Query|*}
 */
exports.delete = function (id) {
    return RoleModel.findOneAndUpdate({_id: id}, {is_deleted: true, update_at: new Date()})
};

/**
 * 新建
 * @param data
 * @returns {Promise|*}
 */
exports.newAndSave = function (data) {
    return new RoleModel(data).save();
};

