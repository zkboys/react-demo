const logger = require('../common/logger');
/**
 * 对res进行扩展
 * @param req
 * @param res
 * @param next
 */
exports.resExtend = function (req, res, next) {

    res.render404 = function (error) {
        return res.status(404).render('notify', {error: error});
    };

    res.renderError = function (error, statusCode) {
        if (statusCode === undefined) {
            statusCode = 400;
        }
        return res.status(statusCode).render('notify', {error: error});
    };

    res.sendError = function (options) {
        if (arguments.length === 1 && typeof arguments[0] === 'string') {
            return res.status(400).send({error: null, message: arguments[0]});
        }

        const error = options.error;
        const status = options.status || 400;
        const message = options.message;

        if (error) {
            logger.error(error);
        }
        return res.status(status).send({error, message});
    };

    res.sendSuccess = function () {
        return res.send({success: true});
    };
    next();
};
