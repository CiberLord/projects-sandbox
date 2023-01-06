import { combineReducers } from 'redux';
import { modalReducer } from './modals';
import { configReducer } from './config';
import { IRootStore } from './types';

const rootReducer = combineReducers<IRootStore>({
    modal: modalReducer,
    config: configReducer,
});

export { rootReducer };
