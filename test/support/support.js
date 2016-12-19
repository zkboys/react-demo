const userProxy = require('../../proxy/user');
const tools = require('../../common/tools');
(async function () {
    const admin = await userProxy.getUserByLoginName('admin');
    const adminCookie = 'mock_user=' + JSON.stringify({
            _id: admin._id,
            loginname: admin.loginname,
            pass: admin.pass,
            salt: admin.salt,
            role_id: admin.role_id,
            is_first_login: admin.is_first_login,
            org_key: admin.org_key,
            is_locked: admin.is_locked,
        }) + ';'
    exports.adminUserCookie = adminCookie;
})();
