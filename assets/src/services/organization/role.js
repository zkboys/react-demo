import * as request from '../request';

export function getAllRoles() {
    return request.get('/organization/roles')
        .then(data => data);
}
