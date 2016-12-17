const MenuProxy = require('../proxy/menu');

exports.getAllMenus = async function () {
    return await MenuProxy.getAllMenus();
};

exports.updateAllMenus = async function (menus) {
    return await MenuProxy.updateAllMenus(menus)
}