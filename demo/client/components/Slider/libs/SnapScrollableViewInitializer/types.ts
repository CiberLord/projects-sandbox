export enum ScrollHandlerTypes {
    SCROLL = 'SCROLL',
    SCROLL_END = 'SCROLL_END',
    SCROLL_START = 'SCROLL_START',
}

export interface IScrollEvent {
    currentSnapPoint: number;
    scrollX: number;
}

export interface IScrollToOptions {
    x: number;
    sticky?: 'nearest' | 'bottom';
}

export interface ISnapScrollableViewInitializerOptions {
    containerNode: HTMLDivElement;
    scrollableNode: HTMLDivElement;
    snapPoints: number[];
    safeEdges?: boolean;
}
