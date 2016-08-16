import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as appService from '../services/app';

export const logout = createAction(types.LOGOUT, async() => {
    return await appService.logout();
});

export const getMenus = createAction(types.GET_MENUS, () => {
    return appService.getMenus();
});

export const getUser = createAction(types.GET_USER, () => {
    return appService.getUser();
});

export const setSideBarStatus = createAction(types.SET_SIDE_BAR_STATUS, () => {
    return appService.getMenus();
});

export const setHeaderMenuStatus = createAction(types.SET_HEADER_MENU_STATUS, () => {
    return appService.getMenus();
});
export const setPageHeaderStatus = createAction(types.SET_PAGE_HEADER_STATUS, () => {
    return appService.getMenus();
});
