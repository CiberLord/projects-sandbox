import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { useSlidesCollector } from '../hooks/useSlidesCollector';
import { useSlidesData } from '../hooks/useSlidesData';

interface ISliderSlideProps {
    className?: string;
}

const SliderSlide: React.FC<PropsWithChildren<ISliderSlideProps>> = ({ className, children }) => {
    const node = useMemo<{ current: HTMLDivElement | null }>(() => ({ current: null }), []);
    const { slideClassName } = useSlidesData();
    const { addElement, removeElement } = useSlidesCollector();

    useEffect(() => {
        return () => {
            removeElement(node.current as HTMLDivElement);
        };
    }, []);

    return (
        <div
            ref={(el) => {
                node.current = el;
                addElement(el as HTMLDivElement);
            }}
            className={cn(className, slideClassName)}>
            {children}
        </div>
    );
};

export { SliderSlide };
