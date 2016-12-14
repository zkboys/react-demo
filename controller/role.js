var RoleProxy = require('../proxy/Role');

exports.getById = async function (req, res, next) {
    var id = req.params.id;
    try {
        const role = await RoleProxy.getRoleById(id);
        res.send(role);
    } catch (error) {
        res.sendError({
            error,
            message: '获取角色失败',
        });
    }
}

exports.getByPage = async function (req, res, next) {
    var currentPage = parseInt(req.query.currentPage, 10) || 1;
    var pageSize = Number(req.query.pageSize);
    var options = {};
    if (pageSize) {
        options = {skip: (currentPage - 1) * pageSize, limit: pageSize, sort: '-create_at'};
    }
    var query = {};
    // 如下字段进行模糊查询。
    ['name'].forEach(function (v) {
        var value = req.query[v];
        if (value) {
            query[v] = new RegExp(value);
        }
    });
    try {
        const results = await RoleProxy.getRolesByQuery(query, options);
        const totalCount = await RoleProxy.getRolesCountByQuery(query);
        res.send({
            results,
            totalCount,
        });
    } catch (error) {
        res.sendError({
            error,
            message: '获取角色失败',
        });
    }
};

exports.delete = async function (req, res, next) {
    var id = req.body.id;
    try {
        await RoleProxy.delete(id);
        res.sendSuccess();
    } catch (error) {

        res.sendError({
            error,
            message: '删除角色失败',
        });
    }
};

exports.update = async function (req, res, next) {
    var data = req.body;
    try {
        const updatedRole = await RoleProxy.update(data);
        res.send(updatedRole);
    } catch (error) {

        res.sendError({
            error,
            message: '更新角色失败',
        });
    }
};

exports.addAndSave = async function (req, res, next) {
    function error(msg) {
        res.sendError('', msg);
    }

    var data = req.body;
    if (data.name === '') {
        return error('名称不能为空！');
    }

    try {
        const savedRole = await RoleProxy.newAndSave(data);
        res.send(savedRole);
    } catch (error) {
        res.sendError({
            error,
            message: '保存角色失败',
        });
    }
};
