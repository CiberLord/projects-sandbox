import { createContext } from 'react';

import { ISliderSlidesCollectorContext } from './types';

export const SliderSlidesCollectorContext = createContext<ISliderSlidesCollectorContext | null>(
    null,
);
