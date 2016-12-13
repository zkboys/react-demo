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


exports.getUserByLoginName = function (loginName) {
    return new Promise((resolve, reject) => {
        User.findOne({'loginname': new RegExp('^' + loginName + '$', "i"), is_deleted: false}, (error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};
