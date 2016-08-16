import * as types from '../constants/actionTypes';
import config from '../configs';
import {getHeaderMenus, getCurrentHeaderMenuByUrl, convertToTree, getCurrentSidebarMenuByUrl} from '../utils';

let initialState = {
    headerMenus: [],
    sideBarMenus: [],
    sideBarHidden: false,
    user: {
        name: '尚未登录',
    },
    selectedKeys: '',
    openKeys: [],
    currentHeaderKey: '',
    pageHeader: {},
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
    case types.LOGOUT:
        return location.href = config.signInPath;
    case types.GET_USER: {
        return {
            ...state,
            user: payload,
        };
    }
    case types.GET_MENUS: {
        if (!payload || !payload.length) {
            return {
                ...state,
            };
        }

        let headerMenus = getHeaderMenus(payload);
        let headMenu = getCurrentHeaderMenuByUrl(headerMenus);
        let sideBarMenus = [];
        if (headMenu) {
            sideBarMenus = convertToTree(payload, headMenu);
        }
        const sideBarHidden = !sideBarMenus.length;
        headerMenus = headerMenus.filter(menu => {
            return menu.key !== 'system';
        });
        return {
            ...state,
            headerMenus,
            sideBarMenus,
            sideBarHidden,
        };
    }
    case types.SET_SIDE_BAR_STATUS: {
        const {parentKeys: openKeys, key: selectedKeys} = getCurrentSidebarMenuByUrl(payload) || state;
        return {
            ...state,
            openKeys,
            selectedKeys,
        };
    }
    case types.SET_HEADER_MENU_STATUS: {
        const {key: currentHeaderKey} = getCurrentHeaderMenuByUrl(payload) || state;
        return {
            ...state,
            currentHeaderKey,
        };
    }
    case types.SET_PAGE_HEADER_STATUS: {
        const {parentNodes, text, icon} = getCurrentSidebarMenuByUrl(payload) || {};
        let breadcrumb = [];

        if (parentNodes && parentNodes.length) {
            parentNodes.forEach(node => {
                breadcrumb.push({
                    icon: node.icon,
                    text: node.text,
                    path: node.path,
                });
            });
        }

        breadcrumb.push({
            icon,
            text,
        });

        return {
            ...state,
            pageHeader: {
                title: text,
                breadcrumb,
            },
        };
    }
    default:
        return state;
    }
}
