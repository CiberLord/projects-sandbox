export type IVector2 = {
    x: number;
    y: number;
};

export interface IDragEvent {
    isFirst: boolean;
    delta: IVector2;
    direction: IVector2;
    initialDirection: IVector2;
}

export interface IDragEventHandlers {
    onMoveStart?: (event: IDragEvent) => void;
    onMove?: (event: IDragEvent) => void;
    onMoveEnd?: (event: IDragEvent) => void;
    onSwipe?: (event: IDragEvent) => void;
}

export type ICreateDragEventsOptions = [target: Element, handlers: IDragEventHandlers];

export interface IDragEventsEntity {
    destroy: () => void;
}
