var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../common/logger');
var BaseModel = require("./base_model");

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        logger.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});
mongoose.plugin(BaseModel);

// models
require('./user');
require('./menu');
require('./role');
require('./organization');


exports.Menu = mongoose.model('Menu');
exports.Role = mongoose.model('Role');
exports.User = mongoose.model('User');
exports.Organization = mongoose.model('Organization');

