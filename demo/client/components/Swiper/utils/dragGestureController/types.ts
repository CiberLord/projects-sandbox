export type IVector2 = {
    x: number;
    y: number;
};

export interface IDragGestureState {
    isFirst: boolean;
    startTime: number;
    delta: IVector2;
    direction: IVector2;
    currentPosition: IVector2;
    startPosition: IVector2;
}

export interface IDragGestureEvent {
    isFirst: boolean;
    delta: IVector2;
    startPosition: IVector2;
    currentPosition: IVector2;
    direction: IVector2;
    event: TouchEvent;
}

export interface IDragGestureOptions {
    swipe?: {
        threshold: number;
        distance: number;
    };
    axis?: 'x' | 'y' | 'xy';
}

export interface IDragGestureConstructor {
    target: HTMLElement;
    onDragStart?: (event: IDragGestureEvent) => void;
    onDrag?: (event: IDragGestureEvent) => void;
    onDragEnd?: (event: IDragGestureEvent) => void;
    onSwipe?: (event: IDragGestureEvent) => void;
    options?: IDragGestureOptions;
}

export interface IDragGestureController {
    destroy: () => void;
}
