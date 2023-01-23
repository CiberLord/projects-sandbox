import { useRef } from 'react';
import { ISliderDomRefs } from '../factories/types';

export const useSliderDomNodes = (): ISliderDomRefs => {
    const container = useRef<HTMLDivElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const slides = useRef<HTMLDivElement[]>([]);

    return {
        container,
        wrapper,
        track,
        slides,
    };
};
