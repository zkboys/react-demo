import * as types from '../constants/ActionTypes';
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
        const headerMenus = getHeaderMenus(payload);
        let headMenu = getCurrentHeaderMenuByUrl(headerMenus);
        let sideBarMenus = [];
        if (headMenu) {
            sideBarMenus = convertToTree(payload, headMenu);
        }
        const sideBarHidden = !sideBarMenus.length;
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
    default:
        return state;
    }
}

