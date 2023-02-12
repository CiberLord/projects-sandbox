import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { ISliderConstructorProps } from './types';
import { SliderContextProvider } from '../SliderContextProvider';
import { SliderArrowsConstructor } from '../SliderArrowsConstructor';
import { useSlider } from '../hooks/useSlider';

const SliderConstructor: React.FC<PropsWithChildren<ISliderConstructorProps>> = (props) => {
    const {
        className,
        sliderScrollableClassName,
        sliderContainerClassName,
        children,
        pagination: Pagination,
        arrows: Arrows,
        ...modeOptions
    } = props;
    const { slider, activeSlide, slidesCount } = useSlider(modeOptions);

    const sliderAttributes = slider.getElementsAttributes();

    return (
        <div className={className}>
            <div
                ref={slider.setContainerElement}
                style={sliderAttributes.container?.style}
                className={cn(sliderContainerClassName, sliderAttributes.container?.className)}>
                <div
                    ref={slider.setScrollableElement}
                    style={sliderAttributes.scrollable?.style}
                    className={cn(
                        sliderAttributes.scrollable?.className,
                        sliderScrollableClassName,
                    )}>
                    <SliderContextProvider
                        slideStyle={sliderAttributes.slide?.style}
                        slideClassName={sliderAttributes.slide?.className}
                        addSlideElement={slider.addSlideElement}
                        removeSlideElement={slider.removeSlideElement}>
                        {children}
                    </SliderContextProvider>
                </div>
            </div>
            {Pagination && (
                <Pagination
                    slider={slider}
                    activeSlide={activeSlide}
                    slidesCount={slidesCount}
                />
            )}
            {Arrows && (
                <SliderArrowsConstructor
                    slider={slider}
                    component={Arrows}
                />
            )}
        </div>
    );
};

const MemoComponent = React.memo(SliderConstructor);

export { MemoComponent as SliderConstructor };
