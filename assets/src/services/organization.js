import * as request from './request';

export function getAllOrganizations() {
    return request.get('/organization/organizations')
        .then(data => data);
}
