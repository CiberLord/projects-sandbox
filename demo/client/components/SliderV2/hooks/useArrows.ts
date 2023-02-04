import { useCallback, useEffect, useState } from 'react';
import { EventTypes, IArrowProps, ISliderInjectedOptions } from '../types';

export const useArrows = ({ slider }: ISliderInjectedOptions): IArrowProps => {
    const [activePrevButton, setShowPrevButton] = useState<boolean>(false);
    const [activeNextButton, setShowNextButton] = useState<boolean>(true);

    const setPrev = useCallback(() => {
        slider.toPrev();
    }, [slider]);

    const setNext = useCallback(() => {
        slider.toNext();
    }, [slider]);

    useEffect(() => {
        slider.addListener(EventTypes.ENTER_FIRST, () => {
            setShowPrevButton(false);
        });
        slider.addListener(EventTypes.LEAVE_FIRST, () => {
            setShowPrevButton(true);
        });
        slider.addListener(EventTypes.ENTER_LAST, () => {
            setShowNextButton(false);
        });
        slider.addListener(EventTypes.LEAVE_LAST, () => {
            setShowNextButton(true);
        });
    }, [slider]);

    return {
        activePrevButton,
        activeNextButton,
        setPrev,
        setNext,
    };
};
