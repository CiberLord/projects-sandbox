import { HandlersController } from '../HandlersController';

export enum ScrollListeners {
    SCROLL = 'SCROLL',
    SCROLL_END = 'SCROLL_END',
    SCROLL_START = 'SCROLL_START',
}

export interface IScrollEvent {
    scrollPosition: number;
}

export interface IScrollToOptions {
    scrollPosition: number;
}

export type IScrollListener = (event: IScrollEvent) => void;

export interface IScrollableContainerFactoryParams {
    container: HTMLDivElement;
    scrollableContainer: HTMLDivElement;
    snapPoints: number[];
    onScrollEnd?: (event: IScrollEvent) => void;
}

export type IScrollableViewListener = (
    type: ScrollListeners,
    listener: (event: IScrollEvent) => void,
) => void;

export interface IScrollableViewContext {
    scrollPosition: number;
    currentPosition: number;
    currentSnapPoint: number;
    startEdge: number;
    endEdge: number;
}

export interface IScrollableViewController {
    destroy: () => void;
    scrollTo: (options: IScrollToOptions) => void;
    addHandler: IScrollableViewListener;
}
