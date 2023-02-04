import { useCallback, useMemo, useState } from 'react';

import { ISliderElements } from '../types';

type RefSetter = (el: HTMLDivElement | null) => void;

export const useSliderElements = () => {
    const [slidesCount, setSlidesCount] = useState(0);

    const elements = useMemo<ISliderElements>(() => {
        return {
            slides: [],
        };
    }, []);

    const setContainerElement: RefSetter = (el) => {
        if (el) {
            elements.container = el;
        }
    };

    const setWrapperElement: RefSetter = (el) => {
        if (el) {
            elements.wrapper = el;
        }
    };

    const setListElement: RefSetter = (el) => {
        if (el) {
            elements.list = el;
        }
    };

    const addSlideElement = useCallback<RefSetter>((el) => {
        if (!el) {
            return;
        }

        elements.slides.push(el);
        setSlidesCount((value) => value + 1);
    }, []);

    const removeSlideElement = useCallback<RefSetter>((el) => {
        const index = elements.slides.findIndex((item) => item === el);

        if (index < 0) {
            return index;
        }

        elements.slides.splice(index, 1);
    }, []);

    return {
        elements,
        slidesCount,
        addSlideElement,
        removeSlideElement,
        setContainerElement,
        setWrapperElement,
        setListElement,
    };
};
