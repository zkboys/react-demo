import {handleActions} from 'redux-actions';
import deepCopy from 'deepcopy';
import * as types from '../../constants/actionTypes';

let initialState = {
    gettingAllRoles: false,
    roles: [],
    gettingRoles: false,
    deleting: {},
    savingOrUpdatingRole: false,
    currentPage: 1,
    pageSize: 10,
    rolesByParams: {
        results: [],
        totalCount: 0,
    },
    showEditModal: false,
    role: {
        name: '',
        description: '',
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
    [types.SHOW_ROLE_EDIT_MODAL](state, action) {
        const {payload} = action;
        return {
            ...state,
            ...payload,
            showEditModal: true,
        };
    },
    [types.HIDE_ROLE_EDIT_MODAL](state) {
        return {
            ...state,
            showEditModal: false,
        };
    },
    [types.ADD_ROLE](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const savingOrUpdatingRole = sequence.type === 'start';

        if (savingOrUpdatingRole || error) {
            return {
                ...state,
                savingOrUpdatingRole,
            };
        }

        const rolesByParams = deepCopy(state.rolesByParams);
        rolesByParams.results.unshift(payload);

        return {
            ...state,
            savingOrUpdatingRole,
            rolesByParams,
        };
    },
    [types.UPDATE_ROLE](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}, params} = meta;
        const savingOrUpdatingRole = sequence.type === 'start';

        if (savingOrUpdatingRole || error) {
            return {
                ...state,
                savingOrUpdatingRole,
            };
        }

        const rolesByParams = deepCopy(state.rolesByParams);

        rolesByParams.results.forEach((u, i, array) => {
            if (u._id === params._id) {
                array[i] = {...u, ...params};
            }
        });

        return {
            ...state,
            savingOrUpdatingRole,
            rolesByParams,
        };
    },
}, initialState);
