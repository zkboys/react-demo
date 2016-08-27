import * as request from '../request';

export function getAll() {
    return request.get('/system/menus')
        .then(data => data);
}

export function save(params) {
    return request.post('/system/menus', params)
        .then(data => data);
}
