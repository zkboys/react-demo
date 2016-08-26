import {combineReducers} from 'redux';
import app from './app';
import setting from './system/setting';
import utils from './utils';
import profileMessage from './system/message';
import profilePass from './system/pass';
import organizationUser from './organization/user';
import organizationRole from './organization/role';
import organization from './organization/organization';

export default combineReducers({
    organization,
    organizationRole,
    organizationUser,
    profileMessage,
    profilePass,
    app,
    setting,
    utils,
});
