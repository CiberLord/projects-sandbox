import { useEffect, useMemo, useState } from 'react';
import { ISliderEntity, ISliderOptions } from '../types';
import { useSliderDomNodes } from './useSliderDomNodes';
import { ISliderModuleBaseOptions } from '../factories/types';
import { useSlidesCollectorFactory } from './useSlidesCollectorFactory';
import { useSlideDataFactory } from './useSlideDataFactory';

export const useSliderFactory = <Config extends ISliderModuleBaseOptions>({
    module: Module,
    currentSlide: initialCurrentSlide,
    onChange,
    ...moduleProps
}: ISliderOptions<Config>): ISliderEntity => {
    const domRefs = useSliderDomNodes();
    const { slidesCollector, slidesCount } = useSlidesCollectorFactory(domRefs.slides);
    const [currentSlide, setCurrentSlide] = useState<number>(initialCurrentSlide || 0);

    const sliderEntity = useMemo(
        () =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Module({
                ...moduleProps,
                domRefs,
                currentSlide: initialCurrentSlide,
                onChange: (event) => {
                    onChange?.(event);
                    setCurrentSlide(event.currentSlide);
                },
            }),
        [],
    );

    const slideData = useSlideDataFactory({ sliderEntity });

    useEffect(() => {
        sliderEntity.create();

        return () => {
            sliderEntity.destroy();
        };
    }, [slidesCount]);

    return { domRefs, slidesCount, currentSlide, sliderEntity, slideData, slidesCollector };
};
