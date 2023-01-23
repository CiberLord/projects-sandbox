import React, { PropsWithChildren } from 'react';

import { IArrowsProps, ISliderBaseEntity } from '../types';
import { useArrows } from '../hooks/useArrows';

interface ISliderArrowsProps extends ISliderBaseEntity {
    className?: string;
    component: React.ComponentType<IArrowsProps>;
}

const SliderArrows: React.FC<PropsWithChildren<ISliderArrowsProps>> = ({
    className,
    component: ArrowsComponent,
    sliderEntity,
}) => {
    const { showNextButton, showPrevButton, handleNext, handlePrev } = useArrows({
        sliderEntity,
    });

    return (
        <ArrowsComponent
            className={className}
            showNextButton={showNextButton}
            showPrevButton={showPrevButton}
            toNext={handleNext}
            toPrev={handlePrev}
        />
    );
};

export { SliderArrows };
