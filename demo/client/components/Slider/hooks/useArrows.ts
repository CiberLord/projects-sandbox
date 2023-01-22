import { useCallback, useState } from 'react';
import { ISliderBaseEntity } from '../types';

export const useArrows = ({ sliderInstance }: ISliderBaseEntity) => {
    const [showPrevButton, setShowPrevButton] = useState<boolean>(sliderInstance.hasAllowPrev);
    const [showNextButton, setShowNextButton] = useState<boolean>(sliderInstance.hasAllowNext);

    const handlePrev = useCallback(() => {
        sliderInstance.toPrev(({ hasAllowPrev }) => {
            setShowNextButton(true);
            setShowPrevButton(hasAllowPrev);
        });
    }, [sliderInstance]);

    const handleNext = useCallback(() => {
        sliderInstance.toNext(({ hasAllowNext }) => {
            setShowPrevButton(true);
            setShowNextButton(hasAllowNext);
        });
    }, [sliderInstance]);

    return {
        showPrevButton,
        showNextButton,
        handlePrev,
        handleNext,
    };
};
