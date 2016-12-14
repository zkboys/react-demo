var models = require('../models');
var UserModel = models.User;

exports.getUserById = function (id) {
    return UserModel.findOne({_id: id});
};

exports.getUsersByIds = function (ids) {
    return UserModel.find({'_id': {'$in': ids}});
};

exports.getUsersByQuery = function (query, opt) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return UserModel.find(query, '', opt);
};

exports.getUsersCountByQuery = function (query) {
    if (query.is_deleted === undefined) {
        query.is_deleted = false;
    }
    return UserModel.count(query);
};

exports.getUsersByNames = function (names) {
    return UserModel.find({loginname: {$in: names}});
};

exports.newAndSave = function (user) {
    return new UserModel(user).save();
};

exports.getUserByLoginName = function (loginName) {
    return UserModel.findOne({'loginname': new RegExp('^' + loginName + '$', "i"), is_deleted: false});
};


exports.getUserByLoginNameFromAllUsers = function (loginName) {
    return UserModel.findOne({'loginname': new RegExp('^' + loginName + '$', "i")});
};

exports.update = function (user) {
    user.update_at = new Date();
    return UserModel.findOneAndUpdate({_id: user._id}, user);
};

exports.delete = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_deleted: true, update_at: new Date()});
};

/**
 * 锁定用户
 * @param id
 * @returns {Query|*}
 */
exports.lock = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_locked: true, update_at: new Date()});
};
/**
 * 解锁用户
 * @param id
 * @returns {Query|*}
 */
exports.unlock = function (id) {
    return UserModel.findOneAndUpdate({_id: id}, {is_locked: false, update_at: new Date()})
};

