import { useContext } from 'react';

import { SliderSlidesCollectorContext } from '../contexts/SliderSlidesCollector';
import { ISliderSlidesCollectorContext } from '../contexts/types';

export const useSlidesCollector = (): ISliderSlidesCollectorContext => {
    const context = useContext(SliderSlidesCollectorContext);

    if (!context) {
        throw new Error(
            'useSlidesCollector() was used out of  SliderSlidesCollectorContext.Provider',
        );
    }

    return context;
};
