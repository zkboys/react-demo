import {createAction} from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const toggleSideBar = createAction(types.TOGGLE_SIDE_BAR, () => ({}), () => ({sync: 'setting'}));
