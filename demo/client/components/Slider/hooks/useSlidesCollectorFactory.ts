import { RefObject, useEffect, useMemo, useState } from 'react';
import { ISliderSlidesCollectorContext } from '../contexts/types';

export const useSlidesCollectorFactory = (slides: RefObject<HTMLDivElement[]>) => {
    const [slidesCount, setSlidesCount] = useState<number>(0);

    const slidesCollector = useMemo<ISliderSlidesCollectorContext>(() => {
        return {
            addElement: (element) => {
                slides.current?.push(element);
            },
            removeElement: (element) => {
                const elementIndex = slides.current?.findIndex((el) => el === element) || -1;

                if (elementIndex > -1) {
                    setSlidesCount((slidesCount) => slidesCount - 1);
                    slides.current?.splice(elementIndex, 1);
                }
            },
        };
    }, []);

    useEffect(() => {
        setSlidesCount(slides.current?.length || 0);
    }, []);

    return {
        slidesCount,
        slidesCollector,
    };
};
