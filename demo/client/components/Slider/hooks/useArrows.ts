import { useCallback, useEffect, useState } from 'react';
import { ISliderBaseEntity } from '../types';

export const useArrows = ({ sliderEntity }: ISliderBaseEntity) => {
    const [showPrevButton, setShowPrevButton] = useState<boolean>(sliderEntity.hasAllowPrev);
    const [showNextButton, setShowNextButton] = useState<boolean>(sliderEntity.hasAllowNext);

    const handlePrev = useCallback(() => {
        sliderEntity.toPrev();
    }, [sliderEntity]);

    const handleNext = useCallback(() => {
        sliderEntity.toNext();
    }, [sliderEntity]);

    useEffect(() => {
        sliderEntity.useChange(({ hasAllowNext, hasAllowPrev }) => {
            setShowPrevButton(hasAllowPrev);
            setShowNextButton(hasAllowNext);
        });
    }, [sliderEntity]);

    return {
        showPrevButton,
        showNextButton,
        handlePrev,
        handleNext,
    };
};
