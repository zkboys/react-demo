import * as types from '../constants/actionTypes';

let initialState = {
    loading: false,
    result: '',
};

export default function (state = initialState, action) {
    const {error, meta = {}, type} = action;
    const {sequence = {}} = meta;
    const status = sequence.type === 'start';

    switch (type) {
    case types.SAVE_USER_MESSAGE: {
        if (status) {
            return {
                ...state,
                loading: status,
                result: '',
            };
        }

        if (error) {
            return {
                ...state,
                loading: status,
                result: error,

            };
        }

        return {
            ...state,
            result: 'success',
            loading: status,
        };
    }
    default:
        return state;
    }
}

