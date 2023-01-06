import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './reducers';

export const store = configureStore({
    reducer: rootReducer,
    devTools: true,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    preloadedState: window.__INITIAL_STATE__, // начальное состояние стора которое прилетает из ноды
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.__INITIAL_STATE__ = undefined;

export type AppDispatch = typeof store.dispatch;
