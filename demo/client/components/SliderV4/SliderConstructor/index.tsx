import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { ISliderConstructorProps } from './types';
import { SliderContextProvider } from '../SliderContextProvider';
import { useSlider } from './hooks/useSlider';

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
    const slider = useSlider(modeOptions);

    const slidesStyles = slider.styles;

    return (
        <div className={className}>
            <div
                ref={slider.setContainerElement}
                className={cn(sliderContainerClassName, slidesStyles.container)}>
                <div
                    ref={slider.setScrollableElement}
                    className={cn(slidesStyles.scrollable, sliderScrollableClassName)}>
                    <SliderContextProvider
                        slideClassName={slidesStyles.slide}
                        addSlideElement={slider.addSlideElement}
                        removeSlideElement={slider.removeSlideElement}>
                        {children}
                    </SliderContextProvider>
                </div>
            </div>
            {Pagination && <Pagination slider={slider} />}
            {Arrows && (
                <Arrows
                    activeNextButton={slider.hasNext}
                    activePrevButton={slider.hasPrev}
                    toNext={slider.toNext}
                    toPrev={slider.toPrev}
                />
            )}
        </div>
    );
};

const MemoComponent = React.memo(SliderConstructor);

export { MemoComponent as SliderConstructor };
