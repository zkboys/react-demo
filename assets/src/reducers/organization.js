import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    gettingOrganizations: false,
    organizations: [],
};

export default handleActions({
    [types.GET_ALL_ORGANIZATIONS](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingOrganizations = sequence.type === 'start';
        if (gettingOrganizations || error) {
            return {
                ...state,
                gettingOrganizations,
            };
        }
        return {
            ...state,
            organizations: payload,
        };
    },
}, initialState);
