import {handleActions} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import {convertToTree} from '../../utils';

let initialState = {
    gettingOrganizations: false,
    organizations: [],
    organizationsTreeData: [],
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
        const organizationsTreeData = convertToTree(payload.map(v => {
            v.text = v.name;
            v.label = v.name;
            v.value = v.key;
            return v;
        }));
        return {
            ...state,
            organizations: payload,
            organizationsTreeData,
            gettingOrganizations,
        };
    },
}, initialState);
