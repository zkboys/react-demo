const MenuProxy = require('../proxy/Menu');

exports.getAllMenus = async function () {
    return await MenuProxy.getAllMenus();
};

exports.updateAllMenus = async function (menus) {
    return await MenuProxy.updateAllMenus(menus)
}