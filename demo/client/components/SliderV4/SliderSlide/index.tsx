import React, { PropsWithChildren } from 'react';
import cn from 'classnames';

import { useSlide } from '../hooks/useSlide';

interface ISliderSlideProps {
    className?: string;
}

const SliderSlide: React.FC<PropsWithChildren<ISliderSlideProps>> = ({ className, children }) => {
    const { ref, slideClassName } = useSlide();

    return (
        <div
            ref={ref}
            className={cn(className, slideClassName)}>
            {children}
        </div>
    );
};

export { SliderSlide };
