import {handleActions} from 'redux-actions';
import undoable, {includeAction} from 'redux-undo';
import * as types from '../../constants/actionTypes';
import {convertToTree} from '../../utils';

let initialState = {
    gettingOrganizations: false,
    organizations: [],
    organizationsTreeData: [],
};

const organization = handleActions({
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
        };
    },

    [types.SET_ORGANIZATION_TREE_DATA](state, action) {
        const {payload} = action;
        return {
            ...state,
            organizationsTreeData: payload,
        };
    },
}, initialState);

export default undoable(organization, {
    filter: includeAction([types.SET_ORGANIZATION_TREE_DATA]),
    limit: 10,
    undoType: types.UNDO_ORGANIZATION,
    redoType: types.REDO_ORGANIZATION,
});
