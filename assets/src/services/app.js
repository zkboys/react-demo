import * as requestService from './request';
import {session} from '../utils/storage';

export function logout() {
    return requestService.post('/signout')
        .then(data => data);
}

export function getMenus() {
    return session.getItem('menus');
}

export function getUser() {
    return session.getItem('currentLoginUser');
}
