const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {type: String},
    permissions: {type: Array},
    description: {type: String},
});

RoleSchema.pre('save', function (next) {
    this.update_at = new Date();
    next();
});

mongoose.model('Role', RoleSchema);
