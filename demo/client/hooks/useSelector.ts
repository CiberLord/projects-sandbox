import { TypedUseSelectorHook, useSelector as default_useSelector } from 'react-redux';

import { IRootStore } from '../store';

export const useSelector: TypedUseSelectorHook<IRootStore> = default_useSelector;
