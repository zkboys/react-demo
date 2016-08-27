import {handleActions} from 'redux-actions';
import undoable, {includeAction} from 'redux-undo';
import * as types from '../../constants/actionTypes';
import {convertToTree} from '../../utils';

let initialState = {
    gettingMenuTreeData: false,
    savingMenu: false,
    menusTreeData: [],
    changed: false,
};
/*
 * 这个用来作为menu编辑页面数据，
 * 由于undo组件会改变state结构，这个reducer单独为menu编辑使用
 *
 * */
const menu = handleActions({
    [types.GET_MENU_TREE_DATA](state, action) {
        const {meta = {}, error, payload} = action;
        const {sequence = {}} = meta;
        const gettingMenuTreeData = sequence.type === 'start';
        if (gettingMenuTreeData || error) {
            return {
                ...state,
                gettingMenuTreeData,
            };
        }
        const menusTreeData = convertToTree(payload);
        return {
            ...state,
            menusTreeData,
            changed: false,
            gettingMenuTreeData,
        };
    },

    [types.SET_MENU_TREE_DATA](state, action) {
        const {payload} = action;
        return {
            ...state,
            menusTreeData: payload,
            changed: true,
        };
    },
    [types.SAVE_MENU](state, action) {
        const {meta = {}, error} = action;
        const {sequence = {}} = meta;
        const savingMenu = sequence.type === 'start';

        if (savingMenu || error) {
            return {
                ...state,
                savingMenu,
            };
        }
        return {
            ...state,
            changed: false,
            savingMenu,
        };
    },
}, initialState);

export default undoable(menu, {
    filter: includeAction([types.SET_MENU_TREE_DATA]),
    limit: 10,
    undoType: types.UNDO_MENU,
    redoType: types.REDO_MENU,
});
