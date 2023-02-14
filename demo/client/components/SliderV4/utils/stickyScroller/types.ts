export enum ScrollEvents {
    scroll = 'scroll',
    scrollEnd = 'scrollEnd',
    scrollStart = 'scrollStart',
    swipe = 'swipe',
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
