import { useContext } from 'react';
import { SwiperMethodsContext } from '../context';
import { ISwiperMethodsContext } from '../types';

export const useSwiperMethods = (): ISwiperMethodsContext => {
    const context = useContext(SwiperMethodsContext);

    if (!context) {
        throw new Error('useSwiperMethods must be used within Swiper');
    }

    return context;
};
