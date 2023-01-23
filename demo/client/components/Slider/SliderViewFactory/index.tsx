import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { ISliderOptions, ISliderViewFactoryProps } from '../types';
import { ISliderModuleBaseOptions } from '../factories/types';
import { SliderSlidesCollectorContext } from '../contexts/SliderSlidesCollector';
import { SlideDataContext } from '../contexts/SlideData';
import { useSliderFactory } from '../hooks/useSliderFactory';
import { SliderArrows } from '../SliderArrows';

function SliderViewFactory<Config extends ISliderModuleBaseOptions>({
    module,
    arrows: Arrows,
    pagination: Pagination,
    onChange,
    className,
    trackClassName,
    wrapperClassName,
    children,
    currentSlide: defaultCurrentSlide,
    ...moduleProps
}: PropsWithChildren<ISliderViewFactoryProps<Config>>) {
    const { domRefs, currentSlide, slidesCount, sliderEntity, slideData, slidesCollector } =
        useSliderFactory({
            module,
            currentSlide: defaultCurrentSlide,
            onChange,
            ...moduleProps,
        } as ISliderOptions<Config>);

    const classNames = sliderEntity.getClassNames();

    return (
        <SliderSlidesCollectorContext.Provider value={slidesCollector}>
            <div
                ref={domRefs.container}
                className={cn(classNames.container, className)}>
                <div
                    ref={domRefs.wrapper}
                    className={cn(classNames.wrapper, wrapperClassName)}>
                    <div
                        ref={domRefs.track}
                        className={cn(classNames.track, trackClassName)}>
                        <SlideDataContext.Provider value={slideData}>
                            {children}
                        </SlideDataContext.Provider>
                    </div>
                </div>
                {Pagination && (
                    <Pagination
                        currentSlide={currentSlide}
                        slidesCount={slidesCount}
                        sliderEntity={sliderEntity}
                    />
                )}
                {Arrows && (
                    <SliderArrows
                        component={Arrows}
                        sliderEntity={sliderEntity}
                    />
                )}
            </div>
        </SliderSlidesCollectorContext.Provider>
    );
}

export { SliderViewFactory };
