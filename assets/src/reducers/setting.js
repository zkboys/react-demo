import * as types from '../constants/ActionTypes';

let initialState = {
    isSidebarCollapsed: false,
};

export default function (state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
    case types.TOGGLE_SIDE_BAR: {
        const isSidebarCollapsed = !state.isSidebarCollapsed;
        return {
            ...state,
            isSidebarCollapsed,
        };
    }
    case types.GET_STATE_TO_STORAGE: {
        return {
            ...state,
            ...(payload.setting || initialState),
        };
    }
    default:
        return state;
    }
}

