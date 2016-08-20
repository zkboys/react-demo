'use strict';
const exec = require('child_process').exec;
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../templates');
const chalk = require('chalk');

function getComponentNameMessage(fullName) {
    let fileNames = fullName.split('/');
    let name = fileNames.pop();
    let filePath = fileNames.join('/');

    let upCaseName = name.replace(/(\w)/, function (v) {
        return v.toUpperCase()
    });

    let upCaseNameArray = upCaseName.split('.');
    let fileName = upCaseNameArray[0];
    let suffix = upCaseNameArray.length > 1 && upCaseNameArray[1];
    let componentName = `${fileName}.${suffix || 'jsx'}`;

    fileName = fileName.replace(/(\w)/, function (v) {
        return v.toLowerCase();
    });

    return {
        componentFilePath: `${filePath}${filePath ? '/' : ''}${componentName}`,
        lowerCaseComponentFilePath: `${filePath}${filePath ? '/' : ''}${fileName}.js`,
        lowerCaseComponentName: fileName,
    }
}

/**
 * 创建目录，由于nodejs只能在已经存在的目录中创建目录，这里要逐级创建
 * TODO 也许有更好的方法
 * @param dirname
 * @param resultPath
 */
function makeDir(dirname, resultPath) {
    var dirs = dirname.split(path.sep);

    for (let i = 0; i < dirs.length; i++) {
        let d = dirs[i];
        if (d) {
            var resultDir = path.join(resultPath, d);
            if (!fs.existsSync(resultDir)) {
                fs.mkdirSync(resultDir);
            }
            resultPath = path.join(resultPath, d);
        }
    }
}


module.exports = () => {
    co(function *() {
        let promptComponentName = yield prompt('Component name: ');
        let nameMessage = getComponentNameMessage(promptComponentName);
        let componentFilePath = nameMessage.componentFilePath;
        let defaultActionFilePath = nameMessage.lowerCaseComponentFilePath;
        let lowerCaseComponentName = nameMessage.lowerCaseComponentName;

        let actionFilePath = yield prompt(`Action name(default: '${defaultActionFilePath}', input a new name or 's' for skip): `);
        if (!actionFilePath) {
            actionFilePath = defaultActionFilePath
        }

        let actionType;
        if (actionFilePath !== 'no') {
            actionType = yield prompt('Action type: ');
            if (actionType) {
                actionType = actionType.toUpperCase();
            }
        }

        console.log(chalk.green(componentFilePath, actionFilePath, actionType));
        const componentTargetPath = path.join(__dirname, '../../src/layouts');
        const actionTargetPath = path.join(__dirname, '../../src/actions');
        const actionTypeTargetPath = path.join(__dirname, '../../src/constants/actionTypes.js');

        // 写入 component
        const componentOptions = {
            componentFilePath: componentFilePath,
            reducerName: lowerCaseComponentName,
            className: lowerCaseComponentName,
        };
        const componentTargetFilePath = path.join(componentTargetPath, componentOptions.componentFilePath);
        let coverComponent = 'y';

        if (fs.existsSync(componentTargetFilePath)) {
            coverComponent = yield prompt(`'${componentOptions.componentFilePath}' is exist，cover？（y）: `);
            if (!coverComponent) {
                coverComponent = 'y'
            }
        }

        if (coverComponent === 'y') {
            const template = fs.readFileSync(path.join(__dirname, '../templates/component.ejs'), 'utf8');
            const fileStr = ejs.render(template, componentOptions);
            const dirname = path.dirname(componentTargetFilePath);
            // 创建文件夹，否则写文件时会报错
            makeDir(dirname, '/');
            fs.writeFileSync(componentTargetFilePath, fileStr);
            console.log(chalk.green(`create file: ${componentTargetFilePath}`));
        }

        // 写入 action
        let pp = '';
        for (let i = 0; i < (path.dirname(actionFilePath)).split(path.sep).length; i++) {
            pp += '../'
        }
        const actionOptions = {
            actionType: actionType || 'SOME_ACTION_TYPE',
            actionFilePath: actionFilePath,
            pathCount: pp,
        };
        const actionTargetFilePath = path.join(actionTargetPath, actionOptions.actionFilePath);
        let cover = 'y';

        if (fs.existsSync(actionTargetFilePath)) {
            cover = yield prompt(`'${actionOptions.actionFilePath}' is exist，cover？（y）: `);
            if (!cover) {
                cover = 'y'
            }
        }

        if (cover === 'y') {
            const template = fs.readFileSync(path.join(__dirname, '../templates/action.ejs'), 'utf8');
            const fileStr = ejs.render(template, actionOptions);
            const dirname = path.dirname(actionTargetFilePath);
            // 创建文件夹，否则写文件时会报错
            makeDir(dirname, '/');
            fs.writeFileSync(actionTargetFilePath, fileStr);
            console.log(chalk.green(`create file: ${actionTargetFilePath}`));
        }

        // 写入actionType
        if (actionType) {
            const template = fs.readFileSync(path.join(__dirname, '../templates/action-type.ejs'), 'utf8');
            const fileStr = ejs.render(template, {actionType, componentFilePath});
            fs.appendFileSync(actionTypeTargetPath, fileStr, 'utf8');
            console.log(chalk.green(`add action type: ${actionType}`));
        }


        process.exit();
    })
}