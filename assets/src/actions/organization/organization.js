import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as request from '../../commons/request';

export const getAllOrganizations = createAction(types.GET_ALL_ORGANIZATIONS,
    () => request.get('/organization/organizations'),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);
export const getOrganizationTreeData = createAction(types.GET_ORGANIZATION_TREE_DATA,
    () => request.get('/organization/organizations'),
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
    (params) => request.post('/organization/organizations', params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '保存成功！',
        };
    });
