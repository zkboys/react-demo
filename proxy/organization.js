var OrganizationModel = require('../models').Organization;

/**
 * 获取所有组织架构数据
 * @returns {T|*|Query}
 */
exports.getAllOrganizations = function () {
    return OrganizationModel.find();
};
/**
 * 更新全部
 * @param newOrganizations
 * @returns {Promise.<TResult>|Promise|*}
 */
exports.updateAllOrganizations = function (newOrganizations) {
    return OrganizationModel.remove({}).then(() => {
        return OrganizationModel.create(newOrganizations);
    });
};

