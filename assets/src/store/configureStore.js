import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './promiseMiddleware';
import asyncActionCallbackMiddleware from './asyncActionCallbackMiddleware';
import utilsMiddleware from './utilsMiddleware';
import syncReducerToAsyncStorage from './syncReducerToLocalStorage';
import reducers from '../reducers';


let middlewares = [
    thunkMiddleware,
    promiseMiddleware,
    asyncActionCallbackMiddleware,
    utilsMiddleware,
    syncReducerToAsyncStorage,
];

export default function configureStore(initialState) {
    return applyMiddleware(
        ...middlewares
    )(createStore)(reducers, initialState);
}
