import * as request from '../request';

export function getAll() {
    return request.get('/organization/organizations')
        .then(data => data);
}

export function save() {
    return request.post('/organization/organizations')
        .then(data => data);
}
