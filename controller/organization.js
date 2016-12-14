var OrganizationProxy = require('../proxy/Organization');
exports.getAll = async function (req, res, next) {
    try {
        const organizations = await OrganizationProxy.getAllOrganizations();
        res.send(organizations);
    } catch (error) {
        res.sendError({
            error,
            message: '获取组织信息失败',
        })
    }
};
exports.updateAll = async function (req, res, next) {
    var organizations = req.body.organizations;
    try {
        await OrganizationProxy.updateAllOrganizations(organizations);
        res.sendSuccess();
    } catch (error) {
        res.sendError({
            error,
            message: '更新组织失败',
        });
    }
};
