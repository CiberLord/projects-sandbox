import { ISliderConstructorOptions } from '../types';
import { useEffect, useMemo } from 'react';
import { useActiveSlide } from './useActiveSlide';
import { useSliderElements } from './useSliderElements';

export const useSlider = (options: ISliderConstructorOptions) => {
    const { module: SliderModule, ...moduleOptions } = options;

    const {
        slidesCount,
        elements,
        setContainerElement,
        setListElement,
        setWrapperElement,
        addSlideElement,
        removeSlideElement,
    } = useSliderElements();

    const slider = useMemo(() => new SliderModule(moduleOptions), []);

    const { activeSlide } = useActiveSlide({ slider });

    useEffect(() => {
        slider.onMount(elements);

        return () => {
            slider.onDestroy();
        };
    }, [slider]);

    useEffect(() => {
        slider.onUpdate(elements);
    }, [slidesCount]);

    return {
        slider,
        activeSlide,
        slidesCount,
        setContainerElement,
        setListElement,
        setWrapperElement,
        addSlideElement,
        removeSlideElement,
    };
};
