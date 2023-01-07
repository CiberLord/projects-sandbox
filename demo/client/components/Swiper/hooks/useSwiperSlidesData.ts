import { useContext } from 'react';
import { SwiperSlidesDataContext } from '../context';
import { ISwiperSlidesDataContext } from '../types';

export const useSwiperSlidesData = (): ISwiperSlidesDataContext => {
    const context = useContext(SwiperSlidesDataContext);

    if (!context) {
        throw new Error('useSwiperSlidesData must be used within Swiper');
    }

    return context;
};
