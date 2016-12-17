const models = require('../models');
const UserModel = models.User;

exports.getUserById = function (id) {
    return UserModel.findOne({_id: id}).lean().lean();
};

exports.getUsersByIds = function (ids) {
    return UserModel.find({'_id': {'$in': ids}}).lean();
};

exports.getUsersByPage = function (currentPage = 1, pageSize = 10, queries = {}) {
    const options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    const query = {};
    Object.keys(queries).forEach(v=> {
        query[v] = new RegExp(queries[v]);
    });
    query.is_deleted = false;
    return UserModel.find(query, '', options).lean();
}

exports.getUsersByQuery = function (query, opt) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return UserModel.find(query, '', opt).lean();
};

exports.getUsersCountByQuery = function (queries = {}) {
    const query = {};
    Object.keys(queries).forEach(v=> {
        query[v] = new RegExp(queries[v]);
    });

    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return UserModel.count(query);
};

exports.getUsersByNames = function (names) {
    return UserModel.find({loginname: {$in: names}}).lean();
};

exports.addUser = function (user) {
    return new UserModel(user).save();
};

exports.getUserByLoginName = function (loginName) {
    return UserModel.findOne({'loginname': new RegExp('^' + loginName + '$', "i"), is_deleted: false}).lean();
};


exports.getUserByLoginNameFromAllUsers = function (loginName) {
    return UserModel.findOne({'loginname': new RegExp('^' + loginName + '$', "i")}).lean();
};

exports.update = function (user) {
    user.update_at = new Date();
    return UserModel.findOneAndUpdate({_id: user._id}, user).lean();
};

exports.delete = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_deleted: true, update_at: new Date()}).lean();
};

/**
 * 锁定用户
 * @param id
 * @returns {Query|*}
 */
exports.lock = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_locked: true, update_at: new Date()}).lean();
};
/**
 * 解锁用户
 * @param id
 * @returns {Query|*}
 */
exports.unlock = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_locked: false, update_at: new Date()}).lean()
};

