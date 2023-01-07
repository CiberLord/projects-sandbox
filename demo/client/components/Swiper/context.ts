import { createContext } from 'react';

import { ISwiperSlidesDataContext, ISwiperMethodsContext } from './types';

export const SwiperSlidesDataContext = createContext<ISwiperSlidesDataContext | null>(null);

export const SwiperMethodsContext = createContext<ISwiperMethodsContext | null>(null);
