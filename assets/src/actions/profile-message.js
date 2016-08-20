import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserMessage = createAction(types.SAVE_USER_MESSAGE,
    async(userMessage) => await profileService.saveUserMessage(userMessage), // 返回一个promise实例
    (userMessage, resolved, rejected) => {
        return {
            resolved, // 执行异步action成功回调，使页面可以获取异步成功
            rejected, // 执行异步action失败回调，使页面可以处理异步失败
            autoTipError: '保存失败', // 系统自动提示错误， 默认 ‘未知系统错误’ 传递false，不使用系统提示
            autoTipSuccess: '个人信息修改成功', // 默认 false，不显示成功提示信息，
        };
    }
);
