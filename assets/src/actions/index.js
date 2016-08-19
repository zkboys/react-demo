import * as utils from './utils';
import * as app from './app';
import * as setting from './setting';
import * as profileMessage from './profile-message';
import * as profilePass from './profile-pass';

export default {
    ...profilePass,
    ...profileMessage,
    ...app,
    ...setting,
    ...utils,
};
