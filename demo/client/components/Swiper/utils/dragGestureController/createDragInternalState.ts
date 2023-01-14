import { IDragGestureState } from './types';

export const createDragInternalState = (): {
    state: IDragGestureState;
    resetState: () => void;
} => {
    const state: IDragGestureState = {
        isFirst: true,
        startTime: 0,
        delta: { x: 0, y: 0 },
        direction: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
    };

    const resetState = () => {
        state.isFirst = true;
        state.startTime = 0;
        state.delta = { x: 0, y: 0 };
        state.direction = { x: 0, y: 0 };
        state.currentPosition = { x: 0, y: 0 };
        state.startPosition = { x: 0, y: 0 };
    };

    return {
        state,
        resetState,
    };
};
