import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import Router from './Router';

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
}


ReactDOM.render(<App />, document.getElementById('main'));
