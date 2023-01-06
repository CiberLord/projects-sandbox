import { createReducer } from '@reduxjs/toolkit';
import { spaLoadingSuccess } from '../common/actions';
import { IConfigStore } from './types';

const initialSate: IConfigStore = {
    host: '',
    url: '',
};

export const configReducer = createReducer(initialSate, (builder) => {
    builder.addCase(spaLoadingSuccess, (state, action) => {
        const { config } = action.payload.data;

        if (config) {
            state = {
                ...state,
                ...config,
            };
        }
    });
});
