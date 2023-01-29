import { Controller as AnimationController } from '@react-spring/web';

import { HandlersController } from '../HandlersController';

import {
    ScrollHandlerTypes,
    IScrollEvent,
    IScrollToOptions,
    ISnapScrollableViewInitializerOptions,
} from './types';
import { ScrollListeners } from '../scrollableContainerFactory/types';
import { getBottomSnapSlideByScrollPosition, getPaddings } from '../snapPointsUtils/helpers';
import { IDragGestureRecognizer } from '../dragGestureRecognizer/types';
import { createDragGestureRecognizer } from '../dragGestureRecognizer';
import { getCurrentSnapPointSlide } from '../snapPointsUtils/getCurrentSnapPointSlide';
import { getInToRange } from '../getInToRange';

export interface IInternalState {
    scrollX: number;
    currentSnapPoint: number;
    startEdge: number;
    endEdge: number;
    snapPoints: number[];
}

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

class SnapScrollableViewInitializer {
    state: IInternalState;

    gesturesController: IDragGestureRecognizer;

    animationController: AnimationController<{ x: number }>;

    handlersController: HandlersController<typeof ScrollHandlerTypes, IScrollEvent>;

    constructor(options: ISnapScrollableViewInitializerOptions) {
        this.handlersController = new HandlersController({
            types: ScrollHandlerTypes,
        });

        this.animationController = new AnimationController({
            x: 0,
            onChange: (event) => {
                const translateX = this.getTransform(event.value.x);

                options.scrollableNode.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
            },
        });

        this.initializeValues(options);

        this.initializeGestures(options);
    }

    private initializeValues = (options: ISnapScrollableViewInitializerOptions) => {
        const { left, right } = getPaddings(options.containerNode);

        this.state = {
            scrollX: 0,
            currentSnapPoint: 0,
            snapPoints: options.snapPoints,
            startEdge: options.snapPoints[0],
            endEdge:
                options.scrollableNode.scrollWidth -
                (options.containerNode.getBoundingClientRect().width - (left + right)),
        };
    };

    private initializeGestures = (options: ISnapScrollableViewInitializerOptions) => {
        this.gesturesController = createDragGestureRecognizer({
            target: options.containerNode,
            onDragStart: () => {
                this.handlersController.dispatchHandlers(
                    ScrollListeners.SCROLL_START,
                    this.getEvent(),
                );
            },
            onDrag: ({ delta }) => {
                this.state.scrollX = this.getScrollX(delta.x);

                this.animationController.start({
                    x: this.state.scrollX,
                    config: SCROLL_ANIMATION_CONFIG,
                });

                this.handlersController.dispatchHandlers(ScrollListeners.SCROLL, this.getEvent());
            },
            onDragEnd: ({ delta }) => {
                this.state.scrollX = this.getScrollX(delta.x);
                this.scrollTo({ x: this.state.scrollX, sticky: 'nearest' });
            },
            onSwipe: ({ direction }) => {
                this.state.currentSnapPoint = getInToRange(
                    this.state.currentSnapPoint - direction.x,
                    0,
                    this.state.snapPoints.length,
                );

                this.scrollTo({
                    x: this.getSnapPointScrollPosition(),
                });
            },
        });
    };

    private getTransform = (scrollX: number) => {
        return -1 * scrollX;
    };

    private getScrollX = (touchX: number) => {
        let scrollX = this.getSnapPointScrollPosition() - touchX;

        if (scrollX < this.state.startEdge) {
            scrollX = Math.max(-MAX_EDGE_OFFSET, EDGE_TENSION * scrollX);
        }

        if (scrollX > this.state.endEdge) {
            const offset = scrollX - this.state.endEdge;

            scrollX = this.state.endEdge + Math.min(MAX_EDGE_OFFSET, EDGE_TENSION * offset);
        }

        return scrollX;
    };

    private getSnapPointScrollPosition = () => {
        return this.state.snapPoints[this.state.currentSnapPoint];
    };

    private getEvent = () => {
        return {
            scrollX: this.state.scrollX,
            currentSnapPoint: this.state.currentSnapPoint,
        };
    };

    private onAnimationEnd = () => {
        this.handlersController.dispatchHandlers(ScrollListeners.SCROLL_END, this.getEvent());
    };

    public scrollTo = ({ x, sticky }: IScrollToOptions) => {
        if (sticky === 'nearest') {
            this.state.currentSnapPoint = getCurrentSnapPointSlide(this.state.snapPoints, x);
        }

        if (sticky === 'bottom') {
            this.state.currentSnapPoint = getBottomSnapSlideByScrollPosition(
                this.state.snapPoints,
                x,
            );
        }

        this.state.scrollX = this.getSnapPointScrollPosition();

        if (this.state.scrollX < this.state.startEdge) {
            this.state.scrollX = this.state.startEdge;
        }

        if (this.state.scrollX > this.state.endEdge) {
            this.state.scrollX = this.state.endEdge;
        }

        this.animationController.start({
            x: this.state.scrollX,
            onResolve: this.onAnimationEnd,
            config: SCROLL_END_ANIMATION_CONFIG,
        });
    };

    public addHandler = (...args: Parameters<typeof this.handlersController.addHandler>) => {
        this.handlersController.addHandler(args[0], args[1]);
    };

    public destroy = () => {
        this.gesturesController.destroy();
        this.handlersController.destroy();
    };
}

export { SnapScrollableViewInitializer };
