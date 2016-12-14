const config = require('../config');
exports = module.exports = function (key) {
    return function (req, res, next) {
        const currentLoginUser = req.session.user;
        if (currentLoginUser.loginname === config.admin_name) {
            return next();
        }

        const userPermission = currentLoginUser.permissions;
        if (!userPermission || !userPermission.length || !key) {
            return res.sendError({
                status: 403,
                error: new Error('权限不足'),
                message: '您无权进行此操作',
            });
        }
        if (userPermission.indexOf(key) > -1) {
            return next();
        }

        return res.sendError({
            status: 403,
            error: new Error('权限不足'),
            message: '您无权进行此操作',
        });
    }
};
