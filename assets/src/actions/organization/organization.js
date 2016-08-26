import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as organizationService from '../../services/organization/organization';

export const getAllOrganizations = createAction(types.GET_ALL_ORGANIZATIONS,
    async() => await organizationService.getAllOrganizations(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
            autoTipError: '获取组织失败',
        };
    }
);
