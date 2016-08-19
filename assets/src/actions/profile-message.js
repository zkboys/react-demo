import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserMessage = createAction(types.SAVE_USER_MESSAGE, async(userMessage) => await profileService.saveUserMessage(userMessage));
