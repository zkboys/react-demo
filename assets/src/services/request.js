import qs from 'query-string';

function filterStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    let error = new Error(res.statusText);
    error.res = res;
    error.type = 'http';
    throw error;
}


export function get(url, params) {
    if (params) {
        url += `?${qs.stringify(params)}`;
    }

    return fetch(url)
        .then(filterStatus);
}


export function post(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(filterStatus);
}
