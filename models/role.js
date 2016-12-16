var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: {type: String},
    permissions: {type: Array},
    description: {type: String},
});

RoleSchema.pre('save', function (next) {
    this.update_at = new Date();
    next();
});

mongoose.model('Role', RoleSchema);
