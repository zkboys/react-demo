import TipMessage from './tip-message';
import * as Request from './request';

export default {
    required(name) {
        return {required: true, message: TipMessage.canNotBeNull(name)};
    },
    loginName(message) {
        return {
            validator(rule, value, callback) {
                if (value && !(/^[a-zA-Z0-9\-_]+$/i).test(value)) {
                    callback(new Error(message || TipMessage.loginNameFormatError));
                } else {
                    callback();
                }
            },
        };
    },
    /**
     * 判断登录名是否重复
     * @param ignoreValues {Array} 这些名字不进行检测，用于修改的情况。
     * @returns {*}
     */
    checkLoginNameExist(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                Request
                    .get(`/organization/users/loginname/${value}`)
                    .then(data => {
                        if (data && value === data.loginname) {
                            return callback([new Error('抱歉，该登录名已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },
    /**
     * 判断角色名是否重复
     * @param ignoreValues {Array} 这些名字不进行检测，用于修改的情况。
     * @returns {*}
     */
    checkRoleNameExist(ignoreValues = []) {
        if (typeof ignoreValues === 'string') {
            ignoreValues = [ignoreValues];
        }
        return {
            validator(rule, value, callback) {
                if (!value || ignoreValues.indexOf(value) > -1) {
                    return callback();
                }
                Request
                    .get(`/organization/roles/name/${value}`)
                    .then(data => {
                        if (data && value === data.name) {
                            return callback([new Error('抱歉，该角色名已被占用！')]);
                        }
                        callback();
                    })
                    .catch(err => {
                        console.log(err);
                        return callback([new Error((err && err.body && err.body.message) || '未知系统错误')]);
                    });
            },
        };
    },
    mobile(message) {
        return {
            validator(rule, value, callback) {
                // FIXME 这个校验规则不太好
                /*
                 * 匹配格式：
                 11位手机号码
                 3-4位区号，7-8位直播号码，1－4位分机号
                 如：12345678901、1234-12345678-1234
                 * */
                const re = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
                if (value && !re.test(value)) {
                    callback(new Error(message || TipMessage.mobileFormatError));
                } else {
                    callback();
                }
            },
        };
    },
    email(message) {
        return {type: 'email', message: message || TipMessage.emailFormatError};
    },
};
