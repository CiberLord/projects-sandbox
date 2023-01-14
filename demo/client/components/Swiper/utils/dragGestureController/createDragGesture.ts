import {
    IDragGestureConstructor,
    IDragGestureController,
    IDragGestureEvent,
    IDragGestureOptions,
} from './types';
import { createDragInternalState } from './createDragInternalState';

export const createDragGestureController = (
    config: IDragGestureConstructor,
): IDragGestureController => {
    const { options: configOptions } = config;
    const { state, resetState } = createDragInternalState();

    const listenerOptions = {
        passive: false,
    };

    const options: Required<IDragGestureOptions> = {
        swipe: {
            threshold: configOptions?.swipe?.threshold || 250, // максимальное время, за которое можно выполнить свайп
            distance: configOptions?.swipe?.distance || 30, // минимальное расстояние которым нужно провести, чтоб выполнить свайп
        },
        axis: configOptions?.axis || 'x',
    };

    const touchStartListener = (event: TouchEvent) => {
        console.log('TOUCH START');

        state.startTime = performance.now();
        state.startPosition.x = event.touches[0].clientX;
        state.startPosition.y = event.touches[0].clientY;
        state.currentPosition.x = event.touches[0].clientX;
        state.currentPosition.y = event.touches[0].clientY;

        config.onDragStart?.({
            event,
            direction: state.direction,
            isFirst: state.isFirst,
            delta: state.delta,
            startPosition: state.startPosition,
            currentPosition: state.currentPosition,
        });
    };

    const touchMoveListener = (event: TouchEvent) => {
        state.delta.x = event.touches[0].clientX - state.startPosition.x;
        state.delta.y = event.touches[0].clientY - state.startPosition.y;
        state.currentPosition.x = event.touches[0].clientX;
        state.currentPosition.y = event.touches[0].clientY;

        if (state.isFirst) {
            state.direction.x =
                Math.abs(state.delta.x) > Math.abs(state.delta.y)
                    ? state.delta.x / Math.abs(state.delta.x)
                    : 0;

            state.direction.y =
                state.direction.x === 0 ? state.delta.y / Math.abs(state.delta.y) : 0;
        }

        const dragEvent: IDragGestureEvent = {
            event,
            direction: state.direction,
            isFirst: state.isFirst,
            delta: state.delta,
            startPosition: state.startPosition,
            currentPosition: state.currentPosition,
        };

        if (state.direction.x && options.axis === 'x') {
            event.preventDefault();

            console.log('HORIZONTAL SCROLL');

            config.onDrag?.(dragEvent);
        }

        if (state.direction.y && options.axis === 'y') {
            event.preventDefault();

            console.log('VERTICAL SCROLL');

            config.onDrag?.(dragEvent);
        }

        state.isFirst = false;
    };

    const touchEndListener = (event: TouchEvent) => {
        state.delta.x = event.changedTouches[0].clientX - state.startPosition.x;
        state.delta.y = event.changedTouches[0].clientY - state.startPosition.y;
        state.currentPosition.x = event.changedTouches[0].clientX;
        state.currentPosition.y = event.changedTouches[0].clientY;

        const deltaTime = performance.now() - state.startTime;
        const isSwipe =
            deltaTime < options.swipe.threshold &&
            Math.abs(state.delta.x) > options.swipe.distance &&
            state.direction.x;

        const dragEvent: IDragGestureEvent = {
            event,
            direction: state.direction,
            isFirst: state.isFirst,
            delta: state.delta,
            startPosition: state.startPosition,
            currentPosition: state.currentPosition,
        };

        if (isSwipe) {
            config.onSwipe?.(dragEvent);
        } else {
            config.onDragEnd?.(dragEvent);
        }

        resetState();
    };

    config.target.addEventListener('touchstart', touchStartListener, listenerOptions);
    config.target.addEventListener('touchmove', touchMoveListener, listenerOptions);
    config.target.addEventListener('touchend', touchEndListener, listenerOptions);

    return {
        destroy: () => {
            config.target.removeEventListener('touchstart', touchStartListener);
            config.target.removeEventListener('touchmove', touchMoveListener);
        },
    };
};
