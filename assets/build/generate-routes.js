/* eslint-disable */
/*
 * 递归同步抓取src/page下所有routes.js文件
 * 最终生成src/page/allRoutes.js文件
 * */
var fs = require('fs');
var path = require('path');

// routes.js 所处的文件夹路径
var routePath = path.join(__dirname, '../src');
// 所要抓取的路由文件名称
var routeName = 'routes.js';
// 要生成的 all-routes.js文件位置
var allRoutesPath = path.join(__dirname, '../src/all-routes.js');

function watchAllRoutes() {

// 如果这样 NODE_ENV=development npm run dev ,这里得到的是development，否则默认得到的是dev
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
        var chokidar = require('chokidar');
        var imports = [];
        var routesNames = []
        // One-liner for current directory, ignores .dotfiles
        console.log('watch all the routes.js change, auto generate all-routes.js');
        chokidar.watch(routePath + '/**/routes.js').on('all', (event, path) => {
            console.log(event, path.replace(routePath, ''));
            var im = getImportStr(path);
            var pn = getRouteName(path);
            if (event === 'add') {
                imports.push(im);
                routesNames.push(pn);
                writeAllRoutes(imports, routesNames);
            }
            if (event === 'unlink') {
                arrayRemove(imports, im);
                arrayRemove(routesNames, pn);
                writeAllRoutes(imports, routesNames);
            }
        });
    }
}

/**
 * 递归方式生成all-routes.js文件
 */
function generateAllRoutes() {
    var result = getRoutes(routePath);
    var imports = result.imports;
    var routesNames = result.routesNames;
    writeAllRoutes(imports, routesNames);
}

/**
 * 写入 all-routes.js文件
 * @param imports
 * @param routesNames
 */
function writeAllRoutes(imports, routesNames) {
    // 拼接写入文件的内容
    var fileString = imports.join('\n');
    fileString += '\n\nexport default [].concat(\n    ';
    fileString += routesNames.join(',\n    ');
    fileString += '\n);\n';
    fs.writeFileSync(allRoutesPath, fileString);
}

/**
 * 递归获取要生成得allRoutes.js文件所需内容
 * @param filePath
 * @param fileName
 * @returns {{imports: Array, routesNames: Array}}
 */
function getRoutes(filePath, fileName, _imports, _routesNames) {
    var imports = _imports || []; // 生成文件头部的引入所需的数据
    var routesNames = _routesNames || []; // 生成文件内容所需的数据
    var stat = fs.statSync(filePath);
    var isDir = stat.isDirectory();
    if (isDir) {
        var files = fs.readdirSync(filePath)
        if (files && files.length) {
            files.forEach(function (fn) {
                var fp = path.join(filePath, fn);
                return getRoutes(fp, fn, imports, routesNames);
            });
        }
    } else {
        if (fileName === routeName) {
            var importStr = getImportStr(filePath);
            var pName = getRouteName(filePath);

            routesNames.push(pName);
            imports.push(importStr);

        }
    }
    return {
        imports: imports,
        routesNames: routesNames,
    }
}
/**
 * 根据routes.js绝对路径，构造import 所需字符串
 * @param filePath
 * @returns {string}
 */
function getImportStr(filePath) {
    var pathName = filePath.replace(routePath, '');
    var routesPath = '.' + pathName;
    if (process.platform.indexOf('win') >= 0) {
        routesPath = routesPath.replace(/\\/g, "\/");
    }
    var pName = getRouteName(filePath);
    return "import " + pName + " from '" + routesPath + "';";

}
/**
 * 根据routes.js绝对路径，构造路由引入变量名
 * @param filePath
 * @returns {string}
 */
function getRouteName(filePath) {
    var pathName = filePath.replace(routePath, '');
    pathName = pathName.replace('.js', '');
    pathName = pathName.split(path.sep);
    var pName = '';
    pathName.forEach(function (p) {
        if (p) {
            var ps = p.split('-');
            ps.forEach(function (v) {
                pName += v.replace(/(\w)/, function (v) {
                    return v.toUpperCase()
                });
            });
        }
    });
    return pName;
}

function arrayRemove(arr, item) {
    var itemIndex = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            itemIndex = i;
            break;
        }
    }
    if (itemIndex > -1) {
        arr.splice(itemIndex, 1);
    }
}
exports.generateAllRoutes = generateAllRoutes;
exports.watchAllRoutes = watchAllRoutes;

