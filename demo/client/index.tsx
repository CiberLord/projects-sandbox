import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './store';

import { Router } from './Router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
    <Provider store={store}>
        <Router />
    </Provider>,
);
