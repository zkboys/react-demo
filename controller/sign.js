var User = require('../proxy/user');

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = async function (req, res, next) {
    var loginname = req.body.name;
    var pass = req.body.pass;
    console.log(loginname, pass);
    const user = await User.getUserByLoginName("1");
    console.log(user);
    res.send({ok: true});
};