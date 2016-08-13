import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';
import * as Storage from '../utils/storage';

export const toast = createAction(types.TOAST, (text, timeout) => {
    return {
        text,
        timeout,
        id: new Date().getTime(),
    };
});

export const getStateFromStorage = createAction(types.GET_STATE_TO_STORAGE, () => {
    return Storage.multiGet(['setting']);
}, (resolved, rejected) => {
    return {
        resolved,
        rejected,
    };
});

