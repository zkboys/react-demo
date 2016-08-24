import deepCopy from 'deepcopy';

/**
 * 获取cookie
 * @param objName
 * @returns {string}
 */
export function getCookie(objName) {
    let arrStr = document.cookie.split('; ');
    for (let i = 0; i < arrStr.length; i++) {
        let temp = arrStr[i].split('=');
        if (temp[0] === objName) return unescape(temp[1]);
    }
    return '';
}

/**
 * 获取滚动条宽度
 * @returns {number}
 */
export function getScrollBarWidth() {
    let scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    let scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    window.document.body.removeChild(scrollDiv);
    return scrollBarWidth;
}

/**
 * 获取node中第一个含有path节点的path
 * @param node
 * @param menus
 * @returns {*}
 */
export function getFirstPath(node, menus) {
    if (node.path) return node.path;
    let firstChild;
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (menu.parentKey === node.key) {
            firstChild = menu;
            break;
        }
    }
    if (firstChild) {
        return firstChild.path || getFirstPath(firstChild, menus);
    }
    return null;
}

/**
 * 检测某个节点是否有parent节点
 * @param rows 所有节点
 * @param row 需要判断得节点
 * @returns {boolean}
 */
export function hasParent(rows, row) {
    let parentKey = row.parentKey;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].key === parentKey) return true;
    }
    return false;
}

/**
 * js构造树方法。
 * @param rows 具有key，parentKey关系的扁平数据结构，标题字段为text
 * @param parentNode 开始节点
 * @returns {array}
 */
export function convertToTree(rows, parentNode = {}) {
    // 这个函数会被多次调用，对rows做深拷贝，否则会产生副作用。
    rows = rows.map((row) => {
        return deepCopy(row);
    });
    parentNode = deepCopy(parentNode);

    let nodes = [];
    if (parentNode) {
        nodes.push(parentNode);
    } else {
        // 获取所有的顶级节点
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!hasParent(rows, row.parentKey)) {
                nodes.push(row);
            }
        }
    }

    // 存放要处理的节点
    let toDo = nodes.map((v) => v);

    while (toDo.length) {
        // 处理一个，头部弹出一个。
        let node = toDo.shift();
        // 获取子节点。
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (row.parentKey === node.key) {
                let child = row;
                let parentKeys = [node.key];
                if (node.parentKeys) {
                    parentKeys = node.parentKeys.concat(node.key);
                }
                child.parentKeys = parentKeys;
                let parentTexts = [node.text];
                if (node.parentTexts) {
                    parentTexts = node.parentTexts.concat(node.text);
                }
                child.parentTexts = parentTexts;

                let parentNodes = [{...node}];
                if (node.parentNodes) {
                    parentNodes = node.parentNodes.concat(parentNodes);
                }
                child.parentNodes = parentNodes;

                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                // child加入toDo，继续处理
                toDo.push(child);
            }
        }
    }
    if (parentNode) {
        return nodes[0].children;
    }
    return nodes;
}

/**
 * 获取头部菜单数据
 * @param menusData
 * @returns {Array.<T>|*}
 */
export function getHeaderMenus(menusData) {
    const menus = menusData.filter((menu, index, arr) => {
        return !hasParent(arr, menu);
    });
    menus.forEach((headMenu) => {
        headMenu.path = getFirstPath(headMenu, menusData) || '/';
    });
    return menus;
}
/**
 * 根据url获取当前头部导航菜单
 * @param headerMenus
 * @returns {*}
 */
export function getCurrentHeaderMenuByUrl(headerMenus = []) {
    let pathNames = location.pathname.split('/');
    let headerMenuCurrent = null;
    if (pathNames && pathNames.length > 0) {
        headerMenuCurrent = pathNames[1];
    }
    for (let i = 0; i < headerMenus.length; i++) {
        if (headerMenuCurrent === headerMenus[i].key) {
            return headerMenus[i];
        }
    }
    return null;
}

export function getCurrentSidebarMenuByUrl(menusData = []) {
    let currentPath = location.pathname;
    let currentHeaderMenu = getCurrentHeaderMenuByUrl(getHeaderMenus(menusData));
    let menusTree = convertToTree(menusData, currentHeaderMenu);
    while (menusTree && menusTree.length) {
        // 处理一个，头部弹出一个。
        let node = menusTree.shift();
        if (node.path === currentPath) {
            return node;
        }
        if (node.children) {
            node.children.forEach((v) => {
                menusTree.push(v);
            });
        }
    }
}
/**
 * 获得一个指定范围内的随机数
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomNum(min, max) {
    const range = max - min;
    const rand = Math.random();
    return (min + Math.round(rand * range));
}

/**
 * 为一个dom元素移除class
 * @param selector
 * @param className
 */
export function removeClass(selector, className) {
    const dom = document.querySelector(selector);
    if (!dom) return;
    let domClass = dom.className;
    if (domClass) {
        domClass = domClass.split(' ');
        if (!domClass || !domClass.length) return;
        dom.className = domClass.filter(c => c !== className).join(' ');
    }
}

/**
 * 为一个dom元素添加class
 * @param selector
 * @param className
 */
export function addClass(selector, className) {
    const dom = document.querySelector(selector);
    if (!dom) return;
    let domClass = dom.className;
    if (domClass) {
        domClass = domClass.split(' ');
        if (!domClass || !domClass.length || domClass.indexOf(className) > -1) return;
        domClass.push(className);
        dom.className = domClass.join(' ');
    } else {
        dom.className = className;
    }
}
