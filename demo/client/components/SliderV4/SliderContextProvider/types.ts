import { CSSProperties } from 'react';

export interface ISliderContext {
    slideStyle?: CSSProperties;
    slideClassName?: string;
    addSlideElement: (el: HTMLDivElement | null) => void;
    removeSlideElement: (el: HTMLDivElement | null) => void;
}

export type ISliderContextProviderProps = ISliderContext;
