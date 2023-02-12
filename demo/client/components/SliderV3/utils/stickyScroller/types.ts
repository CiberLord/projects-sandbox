export enum ScrollEvents {
    SCROLL = 'SCROLL',
    SCROLL_END = 'SCROLL_END',
    SCROLL_START = 'SCROLL_START',
    SWIPE = 'SWIPE',
}

export interface IScrollEvent {
    currentSnapPointIndex: number;
    scrollValue: number;
}

export interface IStickyScrollerCreateOptions {
    containerElement: HTMLDivElement;
    draggableElement: HTMLDivElement;
    snapPoints: number[];
    currentSnapPointIndex?: number;
}
