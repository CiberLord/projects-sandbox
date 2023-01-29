import { Controller } from '@react-spring/web';
import { createDragGestureRecognizer } from '../dragGestureRecognizer';
import { getPaddings } from '../snapPointsUtils/helpers';

import {
    IScrollableContainerFactoryParams,
    IScrollableViewContext,
    IScrollEvent,
    IScrollToOptions,
    ScrollListeners,
    IScrollableViewController,
} from './types';
import { getCurrentSnapPointSlide } from '../snapPointsUtils/getCurrentSnapPointSlide';
import { getInToRange } from '../getInToRange';
import { HandlersController } from '../HandlersController';

const SCROLL_ANIMATION_CONFIG = {
    friction: 100,
    tension: 2000,
};

const EDGE_TENSION = 0.2;

const MAX_EDGE_OFFSET = 100;

const SCROLL_END_ANIMATION_CONFIG = {
    friction: 50,
    tension: 500,
};

export const scrollableContainerFactory = ({
    container,
    snapPoints,
    scrollableContainer,
    onScrollEnd,
}: IScrollableContainerFactoryParams): IScrollableViewController => {
    const { left, right } = getPaddings(container);

    const handlersController = new HandlersController<typeof ScrollListeners, IScrollEvent>({
        eventTypes: ScrollListeners,
    });

    const context: IScrollableViewContext = {
        scrollPosition: 0,
        currentPosition: 0,
        currentSnapPoint: 0,
        startEdge: snapPoints[0],
        endEdge:
            scrollableContainer.scrollWidth -
            (container.getBoundingClientRect().width - (left + right)),
    };

    const animation = new Controller<{ x: number }>({
        x: 0,
        onChange: (event) => {
            scrollableContainer.style.transform = `translate3d(${-1 * event.value.x}px, 0px, 0px)`;
        },
    });

    const getPosition = (touchX: number) => {
        let scrollPosition = context.currentPosition - touchX;

        if (scrollPosition < context.startEdge) {
            scrollPosition = Math.max(-MAX_EDGE_OFFSET, EDGE_TENSION * scrollPosition);
        }

        if (scrollPosition > context.endEdge) {
            const offset = scrollPosition - context.endEdge;

            scrollPosition = context.endEdge + Math.min(MAX_EDGE_OFFSET, EDGE_TENSION * offset);
        }

        return scrollPosition;
    };

    const scrollTo = ({ scrollPosition }: IScrollToOptions) => {
        let position = scrollPosition;

        if (scrollPosition < context.startEdge) {
            position = context.startEdge;
        }

        if (scrollPosition > context.endEdge) {
            position = context.endEdge;
        }

        animation.start({
            x: position,
            onResolve: () => {
                context.currentPosition = position;

                handlersController.dispatchHandlers(ScrollListeners.SCROLL_END, {
                    scrollPosition: context.currentPosition,
                });
            },
            config: SCROLL_END_ANIMATION_CONFIG,
        });
    };

    const gestures = createDragGestureRecognizer({
        target: container,
        onDragStart: () => {
            handlersController.dispatchHandlers(ScrollListeners.SCROLL_START, {
                scrollPosition: context.scrollPosition,
            });
        },
        onDrag: ({ delta }) => {
            context.scrollPosition = getPosition(delta.x);

            animation.start({
                x: context.scrollPosition,
                config: SCROLL_ANIMATION_CONFIG,
            });

            handlersController.dispatchHandlers(ScrollListeners.SCROLL, {
                scrollPosition: context.scrollPosition,
            });
        },
        onDragEnd: ({ delta }) => {
            const updatedSlide = getCurrentSnapPointSlide(snapPoints, getPosition(delta.x));

            context.currentSnapPoint = updatedSlide;

            scrollTo({ scrollPosition: snapPoints[updatedSlide] });
        },
        onSwipe: ({ direction }) => {
            context.currentSnapPoint = getInToRange(
                context.currentSnapPoint - direction.x,
                0,
                snapPoints.length,
            );

            scrollTo({
                scrollPosition: snapPoints[context.currentSnapPoint],
            });
        },
    });

    return {
        scrollTo,
        addHandler: handlersController.addHandler,
        destroy: gestures.destroy,
    };
};
