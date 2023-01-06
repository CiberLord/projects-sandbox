import { AnyObject } from '../../../../core/types/utils';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { IModalStore } from './types';

export const openModal = createAction<AnyObject>('MODAL/OPEN_MODAL');

export const closeModal = createAction('MODAL/CLOSE_MODAL');

const initialState: IModalStore = {
    isOpen: false,
    data: {},
};

export const modalReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(openModal, (state, action) => {
            state.isOpen = true;
            state.data = action.payload;
        })
        .addCase(closeModal, (state) => {
            state.isOpen = false;
            state.data = {};
        });
});
