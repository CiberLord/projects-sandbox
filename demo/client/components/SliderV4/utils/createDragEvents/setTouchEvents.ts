import { IDragEventHandlers, IDragEventsEntity, IDragOptions } from './types';
import { createTouchListeners } from './createTouchListeners';

export const setTouchEvents = (
    target: Element,
    handlers: IDragEventHandlers,
    options?: IDragOptions,
): IDragEventsEntity => {
    const { touchStart, touchMove, touchEnd } = createTouchListeners(handlers, options);

    const eventOptions = {
        passive: false,
    };

    target.addEventListener('touchstart', touchStart, eventOptions);
    target.addEventListener('touchmove', touchMove, eventOptions);
    target.addEventListener('touchend', touchEnd, eventOptions);

    return {
        destroy: () => {
            target.removeEventListener('touchstart', touchStart);
            target.removeEventListener('touchmove', touchMove);
            target.removeEventListener('touchend', touchEnd);
        },
    };
};
