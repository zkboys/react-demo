import * as requestService from './request';

export function updateUserMessage(userMessage) {
    return requestService.put('/system/message', userMessage)
        .then(data => data);
}

export function updateUserPass(userPass) {
    return requestService.put('/system/pass', userPass)
        .then(data => data);
}
