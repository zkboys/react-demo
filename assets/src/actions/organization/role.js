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

export const showRoleEditModal = createAction(types.SHOW_ROLE_EDIT_MODAL);
export const hideRoleEditModal = createAction(types.HIDE_ROLE_EDIT_MODAL);

export const addRole = createAction(types.ADD_ROLE,
    async(params) => await organizationRoleService.addRole(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '添加成功！',
        };
    }
);

export const updateRole = createAction(types.UPDATE_ROLE,
    async(params) => await organizationRoleService.updateRole(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '修改成功！',
        };
    }
);
