var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: {type: String},
    permissions: {type: Array},
    description: {type: String},
});

mongoose.model('Role', RoleSchema);
