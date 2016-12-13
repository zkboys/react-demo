var models = require('../models');
var User = models.User;

exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({_id: id}, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    var user = new User();
    user.name = loginname;
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = active || false;

    user.save(callback);
};


exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': new RegExp('^' + loginName + '$', "i"), is_deleted: false}, callback);
};
