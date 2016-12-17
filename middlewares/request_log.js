const logger = require('../common/logger');

const ignore = /^\/(public|agent)/;

exports = module.exports = function (req, res, next) {
    // Assets do not out log.
    if (ignore.test(req.url)) {
        next();
        return;
    }

    const t = new Date();
    logger.info('\n\nStarted', t.toISOString(), req.method, req.url, req.ip);

    res.on('finish', function () {
        const duration = ((new Date()) - t);

        logger.info('Completed', res.statusCode, ('(' + duration + 'ms)').green);
    });

    next();
};
