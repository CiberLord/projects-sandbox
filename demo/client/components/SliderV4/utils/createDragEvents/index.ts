import { IDragEventHandlers, IDragEventsEntity, IDragOptions } from './types';
import { setTouchEvents } from './setTouchEvents';

export const createDragEvents = (
    target: Element,
    handlers: IDragEventHandlers,
    options?: IDragOptions,
): IDragEventsEntity => {
    const touchEvents = setTouchEvents(target, handlers, options);

    return {
        destroy: touchEvents.destroy,
    };
};
