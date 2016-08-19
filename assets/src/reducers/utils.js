import * as types from '../constants/actionTypes';

let initialState = {};

export default function (state = initialState, action) {
    const {payload, type} = action;

    switch (type) {
    case types.TOAST: {
        alert(payload.text);
        return state;
    }
    default:
        return state;
    }
}

