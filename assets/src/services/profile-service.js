import * as requestService from './request';

export function saveUserMessage() {
    return requestService.post('/system/message')
        .then(data => data);
}
