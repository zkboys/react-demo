import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as appService from '../services/app';

export const logout = createAction(types.LOGOUT, async() => {
    return await appService.logout();
});

export const getMenus = createAction(types.GET_MENUS, () => {
    return appService.getMenus();
});

export const getCurrentUser = createAction(types.GET_CURRNET_USER, () => {
    return appService.getCurrentUser();
});

export const autoSetSideBarStatus = createAction(types.AUTO_SET_SIDE_BAR_STATUS, () => {
    return appService.getMenus();
});

export const autoSetHeaderMenuStatus = createAction(types.AUTO_SET_HEADER_MENU_STATUS, () => {
    return appService.getMenus();
});

export const autoSetPageHeaderStatus = createAction(types.AUTO_SET_PAGE_HEADER_STATUS, () => {
    return appService.getMenus();
});

export const setPageHeaderStatus = createAction(types.SET_PAGE_HEADER_STATUS, (options) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(options), 0);
    });
});

export const setPageStatus = createAction(types.SET_PAGE_STATUS);
