import { createAction } from '@reduxjs/toolkit';
import { IRootStore } from '../types';

export const spaLoadingSuccess = createAction<{ data: Partial<IRootStore> }>('SPA/LOADING_SUCCESS');
