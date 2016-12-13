/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
var tools = require('../common/tools');

module.exports = function (schema) {
    schema.add({
        is_deleted: {type: Boolean, default: false},
        create_at: {type: Date, default: Date.now},
        update_at: {type: Date, default: Date.now},
    });

    schema.methods.create_at_ago = function () {
        return tools.formatDate(this.create_at, true);
    };

    schema.methods.update_at_ago = function () {
        return tools.formatDate(this.update_at, true);
    };
};
