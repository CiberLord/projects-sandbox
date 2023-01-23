import { ISliderBaseEntity } from '../types';
import { ISlideDataContext } from '../contexts/types';
import { useMemo } from 'react';

export const useSlideDataFactory = ({ sliderEntity }: ISliderBaseEntity): ISlideDataContext => {
    return useMemo(() => {
        return {
            slideClassName: sliderEntity.getClassNames().item,
        };
    }, [sliderEntity]);
};
