import {handleActions} from 'redux-actions';
import _ from 'lodash';
import * as types from '../../constants/actionTypes';

let initialState = {
    currentPage: 1,
    pageSize: 10,
    savingOrUpdatingUser: false,
    gettingUsers: false,
    switchingLock: {},
    deleting: {},
    resetting: {},
    users: {
        results: [],
        totalCount: 0,
    },
    showUserEditModal: false,
    editModalTitle: '',
    user: {
        name: '',
        loginname: '',
        email: '',
        mobile: '',
        gender: '',
        position: '',
        role_id: '',
        org_key: '',
        is_locked: false,
    },
};

export default handleActions({
    [types.GET_USERS_BY_PARAMS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}, params} = meta;
        const gettingUsers = sequence.type === 'start';
        if (gettingUsers || error) {
            return {
                ...state,
                gettingUsers,
            };
        }
        return {
            ...state,
            users: payload,
            gettingUsers,
            currentPage: params.currentPage,
            pageSize: params.pageSize,
        };
    },
    [types.TOGGLE_LOCK_USER](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        const {id} = meta.params;

        if (loading || error) {
            return {
                ...state,
                switchingLock: {...state.switchingLock, [id]: loading},
            };
        }
        const users = _.cloneDeep(state.users);
        users.results.forEach(u => {
            if (u._id === payload._id) {
                u.is_locked = !payload.is_locked;
            }
        });
        return {
            ...state,
            users,
            switchingLock: {...state.switchingLock, [id]: loading},
        };
    },
    [types.ADD_USER](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const savingOrUpdatingUser = sequence.type === 'start';

        if (savingOrUpdatingUser || error) {
            return {
                ...state,
                savingOrUpdatingUser,
            };
        }

        const users = _.cloneDeep(state.users);
        users.results.unshift(payload);

        return {
            ...state,
            savingOrUpdatingUser,
            users,
        };
    },
    [types.UPDATE_USER](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}, params} = meta;
        const savingOrUpdatingUser = sequence.type === 'start';

        if (savingOrUpdatingUser || error) {
            return {
                ...state,
                savingOrUpdatingUser,
            };
        }

        const users = _.cloneDeep(state.users);

        users.results.forEach((u, i, array) => {
            if (u._id === params._id) {
                array[i] = {...u, ...params};
            }
        });

        return {
            ...state,
            savingOrUpdatingUser,
            users,
        };
    },
    [types.DELETE_USER](state, action) {
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

        const users = _.cloneDeep(state.users);
        users.results = users.results.filter(u => {
            return u._id !== id;
        });

        return {
            ...state,
            deleting: {...state.deleting, [id]: loading},
            users,
        };
    },
    [types.RESET_USER_PASS](state, action) {
        const {meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        const {id} = meta.params;
        let resetting = state;

        resetting[id] = loading;

        return {
            ...state,
            resetting,
        };
    },
    [types.SHOW_USER_EDIT_MODAL](state, action) {
        const {payload} = action;
        if (!payload.user) {
            payload.user = initialState.user;
        }
        return {
            ...state,
            ...payload,
            showUserEditModal: true,
        };
    },
    [types.HIDE_USER_EDIT_MODAL](state) {
        return {
            ...state,
            showUserEditModal: false,
        };
    },
}, initialState);
