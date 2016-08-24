import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as userService from '../services/user';

export const getUsersByParams = createAction(types.GET_USERS_BY_PARAMS,
    async(params) => await userService.getUsersByParams(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const toggleUserLock = createAction(types.TOGGLE_LOCK_USER,
    async(params) => await userService.toggleLock(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const deleteUser = createAction(types.DELETE_USER,
    async(params) => await userService.deleteUser(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const resetUserPass = createAction(types.RESET_USER_PASS,
    async(params) => await userService.resetUserPass(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const showUserEditModal = createAction(types.SHOW_USER_EDIT_MODAL);

export const hideUserEditModal = createAction(types.HIDE_USER_EDIT_MODAL);

export const addUser = createAction(types.ADD_USER,
    async(params) => await userService.addUser(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const updateUser = createAction(types.UPDATE_USER,
    async(params) => await userService.updateUser(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

