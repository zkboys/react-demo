import * as types from '../constants/ActionTypes';
import config from '../configs';
import {getHeaderMenus, getCurrentHeaderMenuByUrl, convertToTree} from '../utils';

let initialState = {
    headerMenus: [],
    sideBarMenus: [],
    user: {
        name: '尚未登录',
    },
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

        return {
            ...state,
            headerMenus,
            sideBarMenus,
        };
    }
    default:
        return state;
    }
}

