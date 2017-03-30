import {createAction} from 'redux-actions';
import * as types from '../../constants/actionTypes';
import * as request from '../../commons/request';

export const getMenuTreeData = createAction(types.GET_MENU_TREE_DATA,
    () => request.get('/system/menus'),
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
    (params) => request.post('/system/menus', params),
    (params, resolved, rejected) => {
        return {
            params,
            resolved,
            rejected,
            autoTipSuccess: '保存成功！',
        };
    });
