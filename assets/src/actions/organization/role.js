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
