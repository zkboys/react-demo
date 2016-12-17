const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String},
    loginname: {type: String},
    pass: {type: String},
    salt: {type: String},
    email: {type: String},
    mobile: {type: String},
    gender: {type: String},
    avatar: {type: String},
    position: {type: String},
    role_id: {type: String},
    is_first_login: {type: Boolean, default: true},
    org_key: {type: String}, // 这里不要使用org_id ，org_id总是变化，key是不变的。
    is_locked: {type: Boolean, default: false},
});

UserSchema.virtual('avatar_url').get(function () {
    return this.avatar;
});

UserSchema.index({loginname: 1}, {unique: true});

UserSchema.pre('save', function (next) {
    this.update_at = new Date();
    next();
});

mongoose.model('User', UserSchema);
