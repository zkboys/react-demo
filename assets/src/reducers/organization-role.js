import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    gettingRoles: false,
    roles: [],
};

export default handleActions({
    [types.GET_ALL_ROLES](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingRoles = sequence.type === 'start';
        if (gettingRoles || error) {
            return {
                ...state,
                gettingRoles,
            };
        }
        return {
            ...state,
            roles: payload.results,
        };
    },
}, initialState);
