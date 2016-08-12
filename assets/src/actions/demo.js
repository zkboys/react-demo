import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';


export const testDemo = createAction(types.GET_UNREAD_MESSAGE_COUNT, () => ({test: 'test-demo'}));

export const testDemo2 = createAction(types.GET_UNREAD_MESSAGE_COUNT, () => 'test-demo2');
