import {combineReducers} from 'redux';
import app from './app';
import setting from './setting';
import profileMessage from './profile-message';
import utils from './utils';

export default combineReducers({
    profileMessage,
    app,
    setting,
    utils,
});
