exports = module.exports = function (controllerFunction) {
    return async function (req, res, next) {
        try {
            await controllerFunction(req, res, next);
        } catch (error) {
            // express 无法捕获异步异常，通过自定义try catch 进行处理
            res.sendError(error);
        }
    };
};