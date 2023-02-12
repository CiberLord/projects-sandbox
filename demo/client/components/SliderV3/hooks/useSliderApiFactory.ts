import { ISliderOptionsBase, SliderApiFactory } from '../types';
import { useLayoutEffect, useMemo } from 'react';

export const useSliderApiFactory = (Factory: SliderApiFactory, options: ISliderOptionsBase) => {
    const slider = useMemo(() => new Factory(options), []);

    useLayoutEffect(() => {
        slider.onMount();
        return () => {
            slider.onDestroy();
        };
    }, []);

    return slider;
};
