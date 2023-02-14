import { useLayoutEffect, useRef } from 'react';
import { useSliderContext } from '../SliderContextProvider/hooks/useSliderContext';

export const useSlide = () => {
    const ref = useRef<HTMLDivElement>(null);

    const { slideClassName, removeSlideElement, addSlideElement } = useSliderContext();

    useLayoutEffect(() => {
        addSlideElement(ref.current);

        return () => {
            removeSlideElement(ref.current);
        };
    }, []);

    return {
        ref,
        slideClassName,
    };
};
