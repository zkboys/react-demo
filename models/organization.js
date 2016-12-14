var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
    key: {type: String}, // 业务关联要使用key，不要使用_id,_id总是变化
    parentKey: {type: String},
    name: {type: String},
    description: {type: String},
    remark: {type: String},
});
OrganizationSchema.index({key: 1}, {unique: true});
mongoose.model('Organization', OrganizationSchema);
