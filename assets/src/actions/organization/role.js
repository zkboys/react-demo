import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as request from '../../commons/request';

export const getPermissionTreeData = createAction(types.GET_PERMISSION_TREE_DATA,
    () => request.get('/system/menus'),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);

export const getAllRoles = createAction(types.GET_ALL_ROLES,
    () => request.get('/organization/roles'),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);

export const getRolesByParams = createAction(types.GET_ROLES_BY_PARAMS,
    (params) => request.get('/organization/roles', params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
        };
    }
);

export const deleteRole = createAction(types.DELETE_ROLE,
    (params) => request.del('/organization/roles', params),
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
    (params) => request.post('/organization/roles', params),
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
    (params) => request.put('/organization/roles', params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '修改成功！',
        };
    }
);
