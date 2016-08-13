import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import * as Router from './Router';
import connectComponent from './utils/connectComponent.js';

const RouterComponent = connectComponent(Router);

const store = configureStore();

function App() {
    return (
        <Provider store={store}>
            <RouterComponent />
        </Provider>
    );
}


ReactDOM.render(<App />, document.getElementById('main'));
