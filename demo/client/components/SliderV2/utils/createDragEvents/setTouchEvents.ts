import { IDragEventHandlers, IDragEventsEntity } from './types';
import { createTouchListeners } from './createTouchListeners';

export const setTouchEvents = (
    target: Element,
    handlers: IDragEventHandlers,
): IDragEventsEntity => {
    const { touchStart, touchMove, touchEnd } = createTouchListeners(handlers);

    const options = {
        passive: false,
    };

    target.addEventListener('touchstart', touchStart, options);
    target.addEventListener('touchmove', touchMove, options);
    target.addEventListener('touchend', touchEnd, options);

    return {
        destroy: () => {
            target.removeEventListener('touchstart', touchStart);
            target.removeEventListener('touchmove', touchMove);
            target.removeEventListener('touchend', touchEnd);
        },
    };
};
