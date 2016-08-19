import * as utilsActions from '../actions/utils';

export default function utilsMiddleware({dispatch}) {
    return next => action => {
        const {payload, error} = action;

        const dispatchToast = (...args) => {
            dispatch(utilsActions.toast(...args));
        };

        // error handle
        if (error && payload.type === 'http') {
            dispatchToast(`${payload.body.message || '未知系统错误'}`);
        }
        next(action);
    };
}
