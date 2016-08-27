import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as organizationService from '../../services/organization/organization';

export const getAllOrganizations = createAction(types.GET_ALL_ORGANIZATIONS,
    async() => await organizationService.getAll(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);
export const getOrganizationTreeData = createAction(types.GET_ORGANIZATION_TREE_DATA,
    async() => await organizationService.getAll(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);
export const setOrganizationTreeData = createAction(types.SET_ORGANIZATION_TREE_DATA);
export const undoOrganization = createAction(types.UNDO_ORGANIZATION);
export const redoOrganization = createAction(types.REDO_ORGANIZATION);
export const saveOrganization = createAction(types.SAVE_ORGANIZATION,
    async(params) => await organizationService.save(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '保存成功！',
        };
    });
