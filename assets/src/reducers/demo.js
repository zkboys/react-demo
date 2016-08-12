import * as types from '../constants/ActionTypes';


let initialState = {
    test: '默认值',
};

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
    case types.GET_UNREAD_MESSAGE_COUNT:
        return {
            ...state,
            ...payload,
        };
    default:
        return state;
    }
}

