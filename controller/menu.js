const MenuService = require('../service/menu');
const controller = require('./controller-utils').controller;

exports.getAllMenus = controller(async function (req, res) {
    const menus = await MenuService.getAllMenus();
    res.send(menus);
});

exports.updateAllMenus = controller(function (req, res, next) {
    var menus = req.body.menus;
    MenuService.updateAllMenus(menus);
    res.sendSuccess();
});
