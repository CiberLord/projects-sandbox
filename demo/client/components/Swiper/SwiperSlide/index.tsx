import React from 'react';
import cn from 'classnames';

import { useSwiperMethods, useSwiperSlidesData } from '../hooks';

export interface ISwiperSlideProps {
    className?: string;
    children?: React.ReactNode;
}

export const SwiperSlide = React.memo<ISwiperSlideProps>(({ className, children }) => {
    const { addSlide } = useSwiperMethods();
    const { slideClassName } = useSwiperSlidesData();

    return (
        <div
            ref={addSlide}
            className={cn(slideClassName, className)}>
            {children}
        </div>
    );
});
