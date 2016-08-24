const Storage = window.localStorage;
const sessionStorage = window.sessionStorage;

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
    keys.forEach(key => values[key] = getItem(key));
    return values;
}

export function multiRemove(keys) {
    keys.forEach(key => removeItem(key));
}

export const session = {
    setItem(key, value) {
        value = JSON.stringify(value);
        sessionStorage.setItem(key, value);
    },
    getItem(key) {
        let value = sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    clear: sessionStorage.clear,
    removeItem: sessionStorage.removeItem,
    multiGet(keys) {
        let values = {};
        keys.forEach(key => values[key] = this.getItem(key));
        return values;
    },
    multiRemove(keys) {
        keys.forEach(key => this.removeItem(key));
    },
};
