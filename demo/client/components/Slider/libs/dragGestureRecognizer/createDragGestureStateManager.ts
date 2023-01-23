import {
    IDragGestureState,
    DragGestureAxis,
    IDragGestureEvent,
    IDragGestureOptions,
} from './types';

export const createDragGestureStateManager = (options: Required<IDragGestureOptions>) => {
    const state: IDragGestureState = {
        isFirst: true,
        startTime: 0,
        endTime: 0,
        delta: { x: 0, y: 0 },
        direction: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        prevPosition: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
    };

    const getDragEvent = (event: TouchEvent): IDragGestureEvent => {
        const easing = options.boundaryTension?.easing || 0.2;
        const currentHorizontalDirection = state.currentPosition.x - state.startPosition.x;

        if (options.boundaryTension.isStart() && currentHorizontalDirection > 0) {
            state.delta.x = state.delta.x * easing;
        } else if (options.boundaryTension.isEnd() && currentHorizontalDirection < 0) {
            state.delta.x = state.delta.x * easing;
        }

        return {
            event,
            direction: state.direction,
            isFirst: state.isFirst,
            delta: state.delta,
            startPosition: state.startPosition,
            prevPosition: state.prevPosition,
            currentPosition: state.currentPosition,
        };
    };

    const shouldDispatchListener = () => {
        return (
            (state.direction.x && options.axis === DragGestureAxis.X) ||
            (state.direction.y && options.axis === DragGestureAxis.XY) ||
            options.axis === DragGestureAxis.XY
        );
    };

    const shouldSwipe = (): boolean => {
        const deltaTime = state.endTime - state.startTime;
        const allowThreshold = deltaTime < options.swipe.threshold;

        if (options.axis === DragGestureAxis.X) {
            return allowThreshold && Math.abs(state.delta.x) > options.swipe.distance;
        }

        if (options.axis === DragGestureAxis.Y) {
            return allowThreshold && Math.abs(state.delta.y) > options.swipe.distance;
        }

        if (options.axis === DragGestureAxis.XY) {
            const isHorizontal = state.delta.x > state.delta.y;

            return allowThreshold && isHorizontal
                ? Math.abs(state.delta.x) > options.swipe.distance
                : Math.abs(state.delta.y) > options.swipe.distance;
        }

        return false;
    };

    const resetState = () => {
        state.isFirst = true;
        state.startTime = 0;
        state.endTime = 0;
        state.delta = { x: 0, y: 0 };
        state.direction = { x: 0, y: 0 };
        state.currentPosition = { x: 0, y: 0 };
        state.prevPosition = { x: 0, y: 0 };
        state.startPosition = { x: 0, y: 0 };
    };

    return {
        state,
        resetState,
        getDragEvent,
        shouldSwipe,
        shouldDispatchListener,
    };
};
