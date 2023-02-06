import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { ISliderConstructorProps } from './types';
import { SliderContextProvider } from '../SliderContextProvider';
import { SliderArrowsConstructor } from '../SliderArrowsConstructor';
import { useSlider } from '../hooks/useSlider';

const SliderConstructor: React.FC<PropsWithChildren<PropsWithChildren<ISliderConstructorProps>>> = (
    props,
) => {
    const { className, children, pagination: Pagination, arrows: Arrows, ...otherProps } = props;
    const {
        slider,
        activeSlide,
        slidesCount,
        removeSlideElement,
        addSlideElement,
        setContainerElement,
        setWrapperElement,
        setListElement,
    } = useSlider(otherProps);

    const classNames = slider.getClassNames();

    return (
        <div
            ref={setContainerElement}
            className={classNames.container}>
            <div
                ref={setWrapperElement}
                className={cn(classNames.wrapper, className)}>
                <div
                    ref={setListElement}
                    className={classNames.list}>
                    <SliderContextProvider
                        slideClassName={classNames.slide}
                        addSlideElement={addSlideElement}
                        removeSlideElement={removeSlideElement}>
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
