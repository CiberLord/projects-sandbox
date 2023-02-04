export interface ISliderContext {
    slideClassName?: string;
    addSlideElement: (el: HTMLDivElement | null) => void;
    removeSlideElement: (el: HTMLDivElement | null) => void;
}

export type ISliderContextProviderProps = ISliderContext;
