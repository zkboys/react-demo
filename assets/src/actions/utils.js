import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as Storage from '../utils/storage';

// 显示提示信息
export const toast = createAction(types.TOAST, ({type, text, timeout = 1000}) => {
    return {
        type,
        text,
        timeout,
        id: new Date().getTime(),
    };
});

// 同步本地数据到state中
export const getStateFromStorage = createAction(types.GET_STATE_FROM_STORAGE, () => {
    return Storage.multiGet(['setting']);
}, (resolved, rejected) => {
    return {
        resolved,
        rejected,
    };
});
