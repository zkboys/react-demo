import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    gettingUsers: false,
    switchingLock: {},
    deleting: {},
    resetting: {},
    users: {
        results: [],
        totalCount: 0,
    },
};

export default handleActions({
    [types.GET_USERS_BY_PARAMS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
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
        };
    },
    [types.TOGGLE_LOCK_USER](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        const {id} = meta.params;
        let switchingLock = state;

        switchingLock[id] = loading;

        if (loading || error) {
            return {
                ...state,
                switchingLock,
            };
        }
        const users = state.users;
        users.results.forEach(u => {
            if (u._id === payload._id) {
                u.is_locked = !payload.is_locked;
            }
        });
        return {
            ...state,
            users,
            switchingLock,
        };
    },
    [types.DELETE_USER](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';
        const {id} = meta.params;
        let deleting = state;

        deleting[id] = loading;

        if (loading || error) {
            return {
                ...state,
                deleting,
            };
        }

        const users = state.users;
        users.results = users.results.filter(u => {
            return u._id !== id;
        });

        return {
            ...state,
            deleting,
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
}, initialState);
