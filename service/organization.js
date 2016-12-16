const OrganizationProxy = require('../proxy/Organization');

exports.getAllOrganizations = async function () {
    return await OrganizationProxy.getAllOrganizations();
};

exports.updateAllOrganizations = async function (organizations) {
    return await OrganizationProxy.updateAllOrganizations(organizations)
}