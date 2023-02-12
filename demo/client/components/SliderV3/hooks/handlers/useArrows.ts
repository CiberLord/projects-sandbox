import { useCallback, useLayoutEffect, useState } from 'react';
import { EventTypes, IArrowProps, ISliderInjectedOptions } from '../../types';

export const useArrows = ({ slider }: ISliderInjectedOptions): IArrowProps => {
    const [activePrevButton, setShowPrevButton] = useState<boolean>(false);
    const [activeNextButton, setShowNextButton] = useState<boolean>(false);

    const setPrev = useCallback(() => {
        slider.toPrev();
    }, [slider]);

    const setNext = useCallback(() => {
        slider.toNext();
    }, [slider]);

    useLayoutEffect(() => {
        slider.addListener(EventTypes.MOUNT, () => {
            setShowNextButton(slider.getSlides()?.length > 1);
        });
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
