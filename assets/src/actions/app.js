import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
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
