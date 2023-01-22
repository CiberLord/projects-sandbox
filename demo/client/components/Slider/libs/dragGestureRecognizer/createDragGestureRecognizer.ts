import Hammer from 'hammerjs';

import {
    IDragGestureConstructor,
    IDragGestureRecognizer,
    DragGestureAxis,
    IDragGestureOptions,
    IVector2,
} from './types';
import { createDragGestureStateManager } from './createDragGestureStateManager';

const INITIAL_SWIPE_DISTANCE = 30;
const INITIAL_SWIPE_THRESHOLD = 250;
const INITIAL_AXIS_VALUE = DragGestureAxis.X;
const BOUNDARY_TENSION_EASING = 0.31;

const getDir = (dir: number): IVector2 => {
    if (dir === Hammer.DIRECTION_UP) {
        return {
            x: 0,
            y: -1,
        };
    }
    if (dir === Hammer.DIRECTION_DOWN) {
        return {
            x: 0,
            y: 1,
        };
    }
    if (dir === Hammer.DIRECTION_LEFT) {
        return {
            x: -1,
            y: 0,
        };
    }
    if (dir === Hammer.DIRECTION_RIGHT) {
        return {
            x: 1,
            y: 0,
        };
    }

    return {
        x: 0,
        y: 0,
    };
};

export const createDragGestureRecognizer = (
    config: IDragGestureConstructor,
): IDragGestureRecognizer => {
    const gestureManager = new Hammer(config.target, {
        touchAction: 'pan-y',
    });

    gestureManager.on('panmove', ({ direction, distance, offsetDirection, deltaY, deltaX }) => {
        console.log(
            'move = direction = ',
            getDir(direction),
            ', deltaX = ',
            deltaX,
            ', deltaY = ',
            deltaY,
        );

        config.onDrag?.({
            direction: getDir(direction),
            delta: {
                x: deltaX,
                y: deltaY,
            },
        });
    });

    gestureManager.on('pancancel', () => {
        console.log('CANCEL');
    });

    gestureManager.on('panend', ({ direction, deltaY, deltaX }) => {
        console.log('END');
        config.onDragEnd?.({
            direction: getDir(direction),
            delta: {
                x: deltaX,
                y: deltaY,
            },
        });
    });

    gestureManager.on('swipe', ({ direction, deltaY, deltaX }) => {
        config.onSwipe?.({
            direction: getDir(direction),
            delta: {
                x: deltaX,
                y: deltaY,
            },
        });
    });

    return {
        destroy: () => gestureManager.destroy(),
    };
};

/*
export const createDragGestureRecognizer = (
    config: IDragGestureConstructor,
): IDragGestureRecognizer => {
    const { options: configOptions } = config;

    const listenerOptions = {
        passive: false,
    };

    const options: Required<IDragGestureOptions> = {
        swipe: {
            threshold: configOptions?.swipe?.threshold || INITIAL_SWIPE_THRESHOLD, // максимальное время, за которое можно выполнить свайп
            distance: configOptions?.swipe?.distance || INITIAL_SWIPE_DISTANCE, // минимальное расстояние которым нужно провести, чтоб выполнить свайп
        },
        axis: configOptions?.axis || INITIAL_AXIS_VALUE, //ось по которому нужно учитывать движение,
        boundaryTension: {
            easing: BOUNDARY_TENSION_EASING,
            isStart: () => false,
            isEnd: () => false,
            ...configOptions?.boundaryTension,
        },
    };

    const { state, resetState, shouldSwipe, getDragEvent, shouldDispatchListener } =
        createDragGestureStateManager(options);

    const touchStartListener = (event: TouchEvent) => {
        state.startTime = performance.now();
        state.startPosition.x = event.touches[0].clientX;
        state.startPosition.y = event.touches[0].clientY;
        state.prevPosition.x = state.currentPosition.x;
        state.prevPosition.y = state.currentPosition.y;
        state.currentPosition.x = event.touches[0].clientX;
        state.currentPosition.y = event.touches[0].clientY;

        config.onDragStart?.(getDragEvent(event));
    };

    const touchMoveListener = (event: TouchEvent) => {
        state.delta.x = event.touches[0].clientX - state.startPosition.x;
        state.delta.y = event.touches[0].clientY - state.startPosition.y;
        state.prevPosition.x = state.currentPosition.x;
        state.prevPosition.y = state.currentPosition.y;
        state.currentPosition.x = event.touches[0].clientX;
        state.currentPosition.y = event.touches[0].clientY;

        if (state.isFirst || options.axis === DragGestureAxis.XY) {
            state.direction.x =
                Math.abs(state.delta.x) > Math.abs(state.delta.y)
                    ? state.delta.x / Math.abs(state.delta.x)
                    : 0;

            state.direction.y =
                state.direction.x === 0 ? state.delta.y / Math.abs(state.delta.y) : 0;
        }

        if (shouldDispatchListener()) {
            event.preventDefault();

            config.onDrag?.(getDragEvent(event));
        }

        state.isFirst = false;
    };

    const touchEndListener = (event: TouchEvent) => {
        state.delta.x = event.changedTouches[0].clientX - state.startPosition.x;
        state.delta.y = event.changedTouches[0].clientY - state.startPosition.y;
        state.currentPosition.x = event.changedTouches[0].clientX;
        state.currentPosition.y = event.changedTouches[0].clientY;
        state.endTime = performance.now();

        if (shouldDispatchListener()) {
            event.preventDefault();

            if (shouldSwipe()) {
                config.onSwipe?.(getDragEvent(event));
            } else {
                config.onDragEnd?.(getDragEvent(event));
            }
        }

        resetState();
    };

    const touchForceChangeListener = (event: TouchEvent) => {
        event.preventDefault();
    };

    config.target.addEventListener('touchmove', touchMoveListener, listenerOptions);
    config.target.addEventListener('touchforcechange', touchForceChangeListener, listenerOptions);
    config.target.addEventListener('touchstart', touchStartListener, listenerOptions);
    config.target.addEventListener('touchend', touchEndListener, listenerOptions);

    return {
        destroy: () => {
            config.target.removeEventListener('touchstart', touchStartListener);
            config.target.removeEventListener('touchmove', touchMoveListener);
            config.target.removeEventListener('touchend', touchEndListener);
            config.target.removeEventListener('touchforcechange', touchForceChangeListener);
        },
    };
};
*/
