var User = require('../proxy/user');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
    var loginname = req.body.name;
    var pass = req.body.pass;
    console.log(loginname, pass);
    User.getUserByLoginName("1", (err, user) => {
        console.log(err, user);
    });
    res.send({ok: true});
};