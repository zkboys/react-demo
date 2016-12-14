var MenuProxy = require('../proxy/Menu');
exports.getAllMenus = async function (req, res) {
    try {
        const menus = await MenuProxy.getAllMenus();
        res.send(menus);
    } catch (error) {
        res.sendError({
            error,
            message: '获取菜单信息失败',
        })
    }
}
exports.updateAllMenus = function (req, res, next) {
    var menus = req.body.menus;
    try {
        MenuProxy.updateAllMenus(menus);
        res.sendSuccess();
    } catch (error) {
        res.sendError({
            error,
            message: '更新菜单失败',
        })
    }
}
