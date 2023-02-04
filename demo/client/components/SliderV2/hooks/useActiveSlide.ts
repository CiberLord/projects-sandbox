import { useEffect, useState } from 'react';
import { EventTypes, ISliderInjectedOptions } from '../types';

export const useActiveSlide = ({ slider }: ISliderInjectedOptions) => {
    const [activeSlide, setActiveSlide] = useState<number>(0);

    useEffect(() => {
        slider.addListener(EventTypes.CHANGE, (event) => {
            setActiveSlide(event.activeSlide);
        });
    }, []);

    return {
        activeSlide,
    };
};
