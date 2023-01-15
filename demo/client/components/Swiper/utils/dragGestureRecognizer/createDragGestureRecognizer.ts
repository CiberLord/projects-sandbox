import {
    IDragGestureConstructor,
    IDragGestureRecognizer,
    DragGestureAxis,
    IDragGestureOptions,
} from './types';
import { createDragGestureStateManager } from './createDragGestureStateManager';

const INITIAL_SWIPE_DISTANCE = 30;
const INITIAL_SWIPE_THRESHOLD = 250;
const INITIAL_AXIS_VALUE = DragGestureAxis.X;
const BOUNDARY_TENSION_EASING = 0.28;

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
        state.currentPosition.x = event.touches[0].clientX;
        state.currentPosition.y = event.touches[0].clientY;

        config.onDragStart?.(getDragEvent(event));
    };

    const touchMoveListener = (event: TouchEvent) => {
        state.delta.x = event.touches[0].clientX - state.startPosition.x;
        state.delta.y = event.touches[0].clientY - state.startPosition.y;
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
