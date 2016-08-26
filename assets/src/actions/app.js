import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as appService from '../services/app';
import {session} from '../utils/storage';
import {getCurrentLoginUser} from '../services/organization/user';

export const logout = createAction(types.LOGOUT, async() => await appService.logout());
export const getMenus = createAction(types.GET_MENUS, () => session.getItem('menus'));
export const getCurrentUser = createAction(types.GET_CURRENT_USER, () => getCurrentLoginUser());
export const updateCurrentUser = createAction(types.UPDATE_CURRENT_USER);
export const autoSetSideBarStatus = createAction(types.AUTO_SET_SIDE_BAR_STATUS, () => session.getItem('menus'));
export const autoSetHeaderMenuStatus = createAction(types.AUTO_SET_HEADER_MENU_STATUS, () => session.getItem('menus'));
export const autoSetPageHeaderStatus = createAction(types.AUTO_SET_PAGE_HEADER_STATUS, () => session.getItem('menus'));
export const setPageHeaderStatus = createAction(types.SET_PAGE_HEADER_STATUS, (options) => {
    return new Promise((resolve) => { // 这样写为了解决一个bug，当时没做记录，忘记了。。。
        setTimeout(() => resolve(options), 0);
    });
});
export const setPageStatus = createAction(types.SET_PAGE_STATUS);
