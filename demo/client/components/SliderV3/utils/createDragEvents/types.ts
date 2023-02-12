export type Normal = -1 | 0 | 1;

export type IVector2 = {
    x: number;
    y: number;
};

export type NormalizeVector = {
    x: Normal;
    y: Normal;
};

export type Axis = 'x' | 'y';

export interface IDragEvent {
    isFirst: boolean;
    delta: IVector2;
    direction: NormalizeVector;
    initialDirection: IVector2;
}

export interface IDragEventHandlers {
    onMoveStart?: (event: IDragEvent) => void;
    onMove?: (event: IDragEvent) => void;
    onMoveEnd?: (event: IDragEvent) => void;
    onSwipe?: (event: IDragEvent) => void;
}

export interface IDragOptions {
    axis: Axis;
}

export interface IDragEventsEntity {
    destroy: () => void;
}
