import { DragStateManager } from './DragStateManager';
import { IDragEventHandlers } from './types';

const getDragStateInput = (event: TouchEvent) => {
    if (event.type === 'touchend') {
        return {
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY,
        };
    }

    return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
    };
};

export const createTouchListeners = (handlers: IDragEventHandlers) => {
    const stateManager = new DragStateManager({
        axis: 'x',
    });

    const touchStart = (event: TouchEvent) => {
        stateManager.onStart(getDragStateInput(event));

        handlers.onMoveStart?.(stateManager.getDragEvent());
    };

    const touchMove = (event: TouchEvent) => {
        stateManager.onMove(getDragStateInput(event));

        if (stateManager.isPreventScroll()) {
            event.preventDefault();

            handlers.onMove?.(stateManager.getDragEvent());
            return;
        }

        return;
    };

    const touchEnd = (event: TouchEvent) => {
        stateManager.onEnd(getDragStateInput(event));

        if (stateManager.isPreventScroll()) {
            event.preventDefault();

            if (stateManager.state.isSwipe && handlers.onSwipe) {
                return handlers.onSwipe(stateManager.getDragEvent());
            }

            handlers.onMoveEnd?.(stateManager.getDragEvent());
        }
    };

    return {
        touchStart,
        touchMove,
        touchEnd,
    };
};
