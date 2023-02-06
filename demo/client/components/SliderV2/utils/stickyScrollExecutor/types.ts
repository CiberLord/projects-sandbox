export enum ScrollEvents {
    SCROLL = 'SCROLL',
    SCROLL_END = 'SCROLL_END',
    SCROLL_START = 'SCROLL_START',
    SWIPE = 'SWIPE',
}

export interface IScrollEvent {
    currentSnapPoint: number;
    scrollValue: number;
}

export interface IStickyScrollExecutorOptions {
    containerNode: HTMLDivElement;
    scrollableNode: HTMLDivElement;
    snapPoints: number[];
    safeEdges?: boolean;
}
