import { useContext } from 'react';
import { SliderContext } from '../context';
import { ISliderContext } from '../types';

export const useSliderContext = (): ISliderContext => {
    const context = useContext(SliderContext);

    if (!context) {
        throw new Error('Hook useSliderContext() was used out of  SliderContext.Provider');
    }

    return context;
};
