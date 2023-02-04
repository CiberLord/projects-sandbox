import { IDragEventHandlers, IDragEventsEntity } from './types';
import { setTouchEvents } from './setTouchEvents';

export const createDragEvents = (
    target: Element,
    handlers: IDragEventHandlers,
): IDragEventsEntity => {
    const touchEvents = setTouchEvents(target, handlers);

    return {
        destroy: touchEvents.destroy,
    };
};
