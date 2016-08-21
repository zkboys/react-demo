import {combineReducers} from 'redux';
import app from './app';
import setting from './setting';
import utils from './utils';
import profileMessage from './profile-message';
import profilePass from './profile-pass';
import organizationUser from './organization-user';
import organizationRole from './organization-role';
import organization from './organization';

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
