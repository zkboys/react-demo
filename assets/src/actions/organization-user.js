import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as userService from '../services/user';

export const getUsersByParams = createAction(types.GET_USERS_BY_PARAMS,
    async(params) => await userService.getUsersByParams(params),
    (params, resolved, rejected) => {
        return {
            resolved,
            rejected,
            autoTipError: '获取用户失败',
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
            autoTipError: '切换锁定状态失败',
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
            autoTipError: '删除用户失败',
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
            autoTipError: '重置用户密码失败',
        };
    }
);
