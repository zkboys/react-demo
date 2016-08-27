import * as request from '../request';

export function getAllRoles() {
    return request.get('/organization/roles')
        .then(data => data);
}

export function getRolesByParams(params) {
    return request.get('/organization/roles', params)
        .then(data => data);
}
