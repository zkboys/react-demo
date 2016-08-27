import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as menuService from '../../services/dev/menu';

export const getMenuTreeData = createAction(types.GET_MENU_TREE_DATA,
    async() => await menuService.getAll(),
    (resolved, rejected) => {
        return {
            resolved,
            rejected,
        };
    }
);
export const setMenuTreeData = createAction(types.SET_MENU_TREE_DATA);
export const undoMenu = createAction(types.UNDO_MENU);
export const redoMenu = createAction(types.REDO_MENU);
export const saveMenu = createAction(types.SAVE_MENU,
    async(params) => await menuService.save(params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '保存成功！',
        };
    });
