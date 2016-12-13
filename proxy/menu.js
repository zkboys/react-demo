var MenuModel = require('../models').Menu;

/**
 * 获取所有菜单
 * @returns {Query|T|*}
 */
exports.getAllMenus = function () {
    return MenuModel.find();
};
/**
 * 跟新所有菜单
 * @param newMenu
 * @returns {Promise|Promise.<TResult>|*}
 */
exports.updateAllMenus = function (newMenu) {
    return MenuModel.remove({}).then(() => {
        return MenuModel.create(newMenu);
    });
}
/**
 * 根据用户，获取此用户有权限得菜单
 * @param user
 * @returns {Query|T|*}
 */
exports.getMenusByUser = function (user) {
    if (user.loginname === 'admin') { // 登录名为admin的用户拥有所有权限
        return MenuModel.find({});
    } else {
        return MenuModel.find({'key': {'$in': user.permissions}});
    }

};
