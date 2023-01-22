import React, { PropsWithChildren } from 'react';

import { IArrowsProps, ISliderBaseEntity } from '../types';
import { useArrows } from '../hooks/useArrows';

interface ISliderArrowsFactoryProps extends ISliderBaseEntity {
    className?: string;
    component: React.ComponentType<IArrowsProps>;
}

const SliderArrowsFactory: React.FC<PropsWithChildren<ISliderArrowsFactoryProps>> = ({
    className,
    component: ArrowsComponent,
    sliderInstance,
}) => {
    const { showNextButton, showPrevButton, handleNext, handlePrev } = useArrows({
        sliderInstance,
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

export { SliderArrowsFactory };
