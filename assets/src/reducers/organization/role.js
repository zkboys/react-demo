import {handleActions} from 'redux-actions';
import deepCopy from 'deepcopy';
import * as types from '../../constants/actionTypes';

let initialState = {
    gettingAllRoles: false,
    roles: [],
    gettingRoles: false,
    deleting: {},
    currentPage: 1,
    pageSize: 10,
    rolesByParams: {
        results: [],
        totalCount: 0,
    },
};

export default handleActions({
    [types.GET_ALL_ROLES](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingAllRoles = sequence.type === 'start';
        if (gettingAllRoles || error) {
            return {
                ...state,
                gettingAllRoles,
            };
        }
        return {
            ...state,
            roles: payload.results,
            gettingAllRoles,
        };
    },
    [types.GET_ROLES_BY_PARAMS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}, params} = meta;
        const gettingRoles = sequence.type === 'start';
        if (gettingRoles || error) {
            return {
                ...state,
                gettingRoles,
            };
        }
        return {
            ...state,
            rolesByParams: payload,
            gettingRoles,
            currentPage: params.currentPage,
            pageSize: params.pageSize,
        };
    },
    [types.DELETE_ROLE](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        const {id} = meta.params;

        if (loading || error) {
            return {
                ...state,
                deleting: {...state.deleting, [id]: loading},
            };
        }

        const rolesByParams = deepCopy(state.rolesByParams);
        rolesByParams.results = rolesByParams.results.filter(u => {
            return u._id !== id;
        });

        return {
            ...state,
            deleting: {...state.deleting, [id]: loading},
            rolesByParams,
        };
    },
}, initialState);
