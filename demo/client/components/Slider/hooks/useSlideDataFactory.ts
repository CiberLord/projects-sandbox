import { ISliderBaseEntity } from '../types';
import { ISlideDataContext } from '../contexts/types';
import { useMemo } from 'react';

export const useSlideDataFactory = ({ sliderInstance }: ISliderBaseEntity): ISlideDataContext => {
    return useMemo(() => {
        return {
            slideClassName: sliderInstance.getClassNames().item,
        };
    }, [sliderInstance]);
};
