import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserPass = createAction(types.UPDATE_USER_PASS,
    async(userPass) => await profileService.updateUserPass(userPass),
    (userPass, resolved, rejected) => {
        return {
            resolved,
            rejected,
            autoTipSuccess: '密码修改成功',
        };
    }
);
