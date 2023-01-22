import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { ISliderOptions, ISliderViewFactoryProps } from '../types';
import { ISliderModuleBaseOptions } from '../factories/types';
import { SliderSlidesCollectorContext } from '../contexts/SliderSlidesCollector';
import { SlideDataContext } from '../contexts/SlideData';
import { useSliderFactory } from '../hooks/useSliderFactory';
import { SliderArrowsFactory } from '../SliderArrowsFactory';

function SliderViewFactory<Config extends ISliderModuleBaseOptions>({
    module,
    arrows: Arrows,
    views,
    onChange,
    className,
    trackClassName,
    wrapperClassName,
    children,
    currentSlide: defaultCurrentSlide,
    ...moduleProps
}: PropsWithChildren<ISliderViewFactoryProps<Config>>) {
    const { domRefs, currentSlide, slidesCount, sliderInstance, slideData, slidesCollector } =
        useSliderFactory({
            module,
            currentSlide: defaultCurrentSlide,
            onChange,
            ...moduleProps,
        } as unknown as ISliderOptions<Config>);

    const classNames = sliderInstance.getClassNames();

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
                {views && (
                    <>
                        {views.map((View, index) => {
                            return (
                                <View
                                    key={index}
                                    currentSlide={currentSlide}
                                    slidesCount={slidesCount}
                                    sliderInstance={sliderInstance}
                                />
                            );
                        })}
                    </>
                )}
                {Arrows && (
                    <SliderArrowsFactory
                        component={Arrows}
                        sliderInstance={sliderInstance}
                    />
                )}
            </div>
        </SliderSlidesCollectorContext.Provider>
    );
}

export { SliderViewFactory };
