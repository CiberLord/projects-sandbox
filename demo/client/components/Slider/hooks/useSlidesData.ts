import { useContext } from 'react';
import { SlideDataContext } from '../contexts/SlideData';

export const useSlidesData = () => {
    const context = useContext(SlideDataContext);

    if (!context) {
        throw new Error('useSlidesData() was used out of  SlideDataContext.Provider');
    }

    return context;
};
