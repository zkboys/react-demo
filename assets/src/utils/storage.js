const Storage = window.localStorage;

export function setItem(key, value) {
    value = JSON.stringify(value);
    Storage.setItem(key, value);
}

export function getItem(key) {
    let value = Storage.getItem(key);
    return JSON.parse(value);
}

export const clear = Storage.clear;

export const removeItem = Storage.removeItem;

export function multiGet(keys) {
    let values = {};
    keys.forEach((key) => {
        values[key] = getItem(key);
    });
    return values;
}

export function multiRemove(keys) {
    keys.forEach((key) => {
        removeItem(key);
    });
}

