import {handleActions} from 'redux-actions';
import _ from 'lodash';
import * as types from '../../constants/actionTypes';
import {convertToTree} from '../../utils';

let initialState = {
    gettingAllRoles: false,
    roles: [],
    gettingRoles: false,
    deleting: {},
    savingOrUpdatingRole: false,
    currentPage: 1,
    pageSize: 10,
    permissionTreeData: [],
    rolesByParams: {
        results: [],
        totalCount: 0,
    },
    showRoleEditModal: false,
    role: {
        name: '',
        description: '',
        permissions: [],
    },
};

export default handleActions({
    [types.GET_PERMISSION_TREE_DATA](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingPermissionTreeData = sequence.type === 'start';
        if (gettingPermissionTreeData || error) {
            return {
                ...state,
                gettingPermissionTreeData,
            };
        }
        const permissionTreeData = convertToTree(payload);
        const loop = d => d.forEach((item) => {
            if (item.functions && item.functions.length) {
                item.functions.forEach(fun => {
                    fun.text = fun.name;
                    fun.parentKey = item.key;
                    fun.parentKeys = _.cloneDeep(item.parentKeys || []);
                    fun.parentKeys.push(item.key);
                });

                if (item.children) {
                    item.children = [...item.children, ...item.functions];
                } else {
                    item.children = [...item.functions];
                }
            }
            if (item.children) {
                loop(item.children);
            }
        });
        loop(permissionTreeData);

        return {
            ...state,
            permissionTreeData,
            gettingPermissionTreeData,
        };
    },
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

        const rolesByParams = _.cloneDeep(state.rolesByParams);
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
        if (!payload.role) {
            payload.role = initialState.role;
        }
        return {
            ...state,
            ...payload,
            showRoleEditModal: true,
        };
    },
    [types.HIDE_ROLE_EDIT_MODAL](state) {
        return {
            ...state,
            showRoleEditModal: false,
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

        const rolesByParams = _.cloneDeep(state.rolesByParams);
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

        const rolesByParams = _.cloneDeep(state.rolesByParams);

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
