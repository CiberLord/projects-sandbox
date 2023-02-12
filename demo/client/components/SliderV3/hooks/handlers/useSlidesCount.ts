import { EventTypes, ISliderInjectedOptions } from '../../types';
import { useState } from 'react';
import { useFirstRender } from '../useFirstRender';

export const useSlidesCount = ({ slider }: ISliderInjectedOptions) => {
    const [slidesCount, setSlidesCount] = useState(slider.getSlides()?.length || 0);

    const isFirstRender = useFirstRender();

    if (isFirstRender) {
        slider.addListener(EventTypes.ADD_SLIDE, () => {
            setSlidesCount((count) => count + 1);
        });
        slider.addListener(EventTypes.REMOVE_SLIDE, () => {
            setSlidesCount((count) => Math.max(0, count - 1));
        });
    }

    return {
        slidesCount,
    };
};
