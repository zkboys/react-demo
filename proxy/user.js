var models = require('../models');
var UserModel = models.User;

exports.getUserById = function (id) {
    return UserModel.findOne({_id: id});
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

