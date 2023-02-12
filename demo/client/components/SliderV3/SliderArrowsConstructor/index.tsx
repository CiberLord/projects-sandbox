import React, { PropsWithChildren } from 'react';

import { IArrowProps, ISliderInjectedOptions } from '../types';
import { useArrows } from '../hooks/handlers/useArrows';

interface ISliderArrowsProps extends ISliderInjectedOptions {
    className?: string;
    component: React.ComponentType<IArrowProps>;
}

const SliderArrowsConstructor: React.FC<PropsWithChildren<ISliderArrowsProps>> = ({
    className,
    slider,
    component: ArrowsComponent,
}) => {
    const { activeNextButton, activePrevButton, setPrev, setNext } = useArrows({
        slider,
    });

    return (
        <ArrowsComponent
            className={className}
            activeNextButton={activeNextButton}
            activePrevButton={activePrevButton}
            setPrev={setPrev}
            setNext={setNext}
        />
    );
};

const MemoComponent = React.memo(SliderArrowsConstructor);

export { MemoComponent as SliderArrowsConstructor };
