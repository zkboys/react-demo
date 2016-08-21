import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as organizationRoleService from '../services/organization-role';

export const getAllRoles = createAction(types.GET_ALL_ROLES,
    async() => await organizationRoleService.getAllRoles(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
            autoTipError: '获取角色失败',
        };
    }
);
