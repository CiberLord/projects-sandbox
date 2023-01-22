export interface ISliderSlidesCollectorContext {
    addElement: (element: HTMLDivElement) => void;
    removeElement: (element: HTMLDivElement) => void;
}

export interface ISlideDataContext {
    slideClassName?: string;
}
