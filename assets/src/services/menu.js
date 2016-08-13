import * as requestService from './request';

export default function getMenus() {
    return requestService.get('/system/menus')
        .then(data => data);
}
