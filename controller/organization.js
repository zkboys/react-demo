const OrganizationService = require('../service/organization');
const controllerDecorator = require('./controller-decorator');

exports.getAll = controllerDecorator(async function (req, res, next) {
    const organizations = await OrganizationService.getAllOrganizations();
    res.send(organizations);
});

exports.updateAll = controllerDecorator(async function (req, res, next) {
    const organizations = req.body.organizations;
    await OrganizationService.updateAllOrganizations(organizations);
    res.sendSuccess();
});
