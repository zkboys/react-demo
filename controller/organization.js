const OrganizationService = require('../service/organization');
const controller = require('./controller-utils').controller;

exports.getAll = controller(async function (req, res, next) {
    const organizations = await OrganizationService.getAllOrganizations();
    res.send(organizations);
});

exports.updateAll = controller(async function (req, res, next) {
    var organizations = req.body.organizations;
    await OrganizationService.updateAllOrganizations(organizations);
    res.sendSuccess();
});
