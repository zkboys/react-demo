import {combineReducers} from 'redux';
import app from './app';
import setting from './setting';
import utils from './utils';
import profileMessage from './profile-message';
import profilePass from './profile-pass';

export default combineReducers({
    profileMessage,
    profilePass,
    app,
    setting,
    utils,
});
