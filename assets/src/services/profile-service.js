import * as requestService from './request';

export function saveUserMessage(userMessage) {
    return requestService.put('/system/message', userMessage)
        .then(data => data);
}
