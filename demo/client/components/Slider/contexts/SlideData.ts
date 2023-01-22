import { createContext } from 'react';
import { ISlideDataContext } from './types';

export const SlideDataContext = createContext<ISlideDataContext | null>(null);
