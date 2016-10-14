/* eslint-disable */
/*
 * 递归同步抓取src/page下所有routes.js文件
 * 最终生成src/page/allRoutes.js文件
 * */
var fs = require('fs');
var path = require('path');

var pagePath = path.join(__dirname, './src');
var allRoutesPath = path.join(__dirname, './src/all-routes.js');
var routesFileName = 'routes.js';

var result = getRoutes(pagePath);
var imports = result.imports;
var routesNames = result.routesNames;

// 拼接写入文件的内容
var fileString = imports.join('\n');
fileString += '\n\nexport default [].concat(\n    ';
fileString += routesNames.join(',\n    ');
fileString += '\n);\n';
fs.writeFileSync(allRoutesPath, fileString);

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
        if (fileName === routesFileName) {
            var pathName = filePath.replace(pagePath, '');
            var routesPath = '.' + pathName;
            if (process.platform.indexOf('win') >= 0) {
                routesPath = routesPath.replace(/\\/g, "\/");
            }
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
            console.log(routesPath);
            routesNames.push(pName);
            imports.push("import " + pName + " from '" + routesPath + "';");
        }
    }
    return {
        imports: imports,
        routesNames: routesNames,
    }
}

