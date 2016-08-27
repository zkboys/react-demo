import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as organizationRoleService from '../../services/organization/role';

export const getAllRoles = createAction(types.GET_ALL_ROLES,
    async() => await organizationRoleService.getAllRoles(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);

export const getRolesByParams = createAction(types.GET_ROLES_BY_PARAMS,
    async(params) => await organizationRoleService.getRolesByParams(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const deleteRole = createAction(types.DELETE_ROLE,
    async(params) => await organizationRoleService.deleteRole(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '角色删除成功！',
        };
    }
);
