import * as types from '../constants/actionTypes';

let initialState = {
    toast: {},
};

export default function (state = initialState, action) {
    const {payload, type} = action;

    switch (type) {
    case types.TOAST: {
        return {
            ...state,
            toast: {
                ...payload,
            },
        };
    }
    default:
        return state;
    }
}

