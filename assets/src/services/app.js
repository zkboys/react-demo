import * as requestService from './request';

export function logout() {
    return requestService.post('/signout')
        .then(data => data);
}
