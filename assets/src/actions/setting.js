import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';

export const toggleSideBar = createAction(types.TOGGLE_SIDE_BAR, () => ({}), () => ({sync: 'setting'}));
