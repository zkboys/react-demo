import {handleActions} from 'redux-actions';
import undoable, {includeAction} from 'redux-undo';
import * as types from '../../constants/actionTypes';
import {convertToTree} from '../../utils';

let initialState = {
    gettingOrganizationTreeData: false,
    organizationsTreeData: [],
    changed: false,
};
/*
 * 这个用来作为organization编辑页面数据，
 * 由于undo组件会改变state结构，这个reducer单独为organization编辑使用
 *
 * */
const organization = handleActions({
    [types.GET_ORGANIZATION_TREE_DATA](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingOrganizationTreeData = sequence.type === 'start';
        if (gettingOrganizationTreeData || error) {
            return {
                ...state,
                gettingOrganizationTreeData,
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
            organizationsTreeData,
            changed: false,
        };
    },

    [types.SET_ORGANIZATION_TREE_DATA](state, action) {
        const {payload} = action;
        return {
            ...state,
            organizationsTreeData: payload,
            changed: true,
        };
    },
}, initialState);

export default undoable(organization, {
    filter: includeAction([types.SET_ORGANIZATION_TREE_DATA]),
    limit: 10,
    undoType: types.UNDO_ORGANIZATION,
    redoType: types.REDO_ORGANIZATION,
});
