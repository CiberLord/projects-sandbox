import { Controller as AnimationController } from '@react-spring/web';

import { HandlersController } from '../HandlersController';

import {
    ScrollHandlerTypes,
    IScrollEvent,
    IScrollToOptions,
    ISnapScrollableViewInitializerOptions,
} from './types';
import { getBottomSnapSlideByScrollPosition, getMaxScrollWidth } from '../snapPointsUtils/helpers';
import { IDragGestureRecognizer } from '../dragGestureRecognizer/types';
import { createDragGestureRecognizer } from '../dragGestureRecognizer';
import { getCurrentSnapPointSlide } from '../snapPointsUtils/getCurrentSnapPointSlide';
import { getInToRange } from '../getInToRange';

export interface IValues {
    scrollX: number;
    currentSnapPoint: number;
    startEdge: number;
    endEdge: number;
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
    private values: IValues;

    private readonly snapPoints: number[];

    private safeEdges: boolean;

    private gesturesController: IDragGestureRecognizer;

    private animationController: AnimationController<{ x: number }>;

    private handlersController: HandlersController<typeof ScrollHandlerTypes, IScrollEvent>;

    constructor(options: ISnapScrollableViewInitializerOptions) {
        this.snapPoints = options.snapPoints;

        this.safeEdges = !!options.safeEdges;

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
        const maxScrollWidth = getMaxScrollWidth(options.containerNode, options.scrollableNode);

        const lasSnapPointPosition = options.snapPoints[options.snapPoints.length - 1];

        this.values = {
            scrollX: 0,
            currentSnapPoint: 0,
            startEdge: options.snapPoints[0],
            endEdge: options.safeEdges ? lasSnapPointPosition : maxScrollWidth,
        };
    };

    private initializeGestures = (options: ISnapScrollableViewInitializerOptions) => {
        this.gesturesController = createDragGestureRecognizer({
            target: options.containerNode,
            onDragStart: () => {
                this.handlersController.dispatchHandlers(
                    ScrollHandlerTypes.SCROLL_START,
                    this.getEvent(),
                );
            },
            onDrag: ({ delta }) => {
                this.values.scrollX = this.getScrollX(delta.x);

                this.animationController.start({
                    x: this.values.scrollX,
                    config: SCROLL_ANIMATION_CONFIG,
                });

                this.handlersController.dispatchHandlers(
                    ScrollHandlerTypes.SCROLL,
                    this.getEvent(),
                );
            },
            onDragEnd: ({ delta }) => {
                this.values.scrollX = this.getScrollX(delta.x);
                this.scrollTo({ x: this.values.scrollX, sticky: 'nearest' });
            },
            onSwipe: ({ direction }) => {
                this.values.currentSnapPoint = getInToRange(
                    this.values.currentSnapPoint - direction.x,
                    0,
                    this.snapPoints.length,
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

        if (scrollX < this.values.startEdge) {
            scrollX = Math.max(-MAX_EDGE_OFFSET, EDGE_TENSION * scrollX);
        }

        if (scrollX > this.values.endEdge) {
            const offset = scrollX - this.values.endEdge;

            scrollX = this.values.endEdge + Math.min(MAX_EDGE_OFFSET, EDGE_TENSION * offset);
        }

        return scrollX;
    };

    private getSnapPointScrollPosition = () => {
        return this.snapPoints[this.values.currentSnapPoint];
    };

    private getEvent = () => {
        return {
            scrollX: this.values.scrollX,
            currentSnapPoint: this.values.currentSnapPoint,
        };
    };

    private onAnimationEnd = () => {
        this.handlersController.dispatchHandlers(ScrollHandlerTypes.SCROLL_END, this.getEvent());
    };

    public getScrollXStart = () => {
        return this.values.startEdge;
    };

    public getMaxScrollWidth = () => {
        return this.values.endEdge;
    };

    public scrollTo = ({ x, sticky }: IScrollToOptions) => {
        if (sticky === 'nearest') {
            this.values.currentSnapPoint = getCurrentSnapPointSlide(this.snapPoints, x);
        }

        if (sticky === 'bottom') {
            this.values.currentSnapPoint = getBottomSnapSlideByScrollPosition(this.snapPoints, x);
        }

        this.values.scrollX = this.getSnapPointScrollPosition();

        if (this.values.scrollX < this.values.startEdge) {
            this.values.scrollX = this.values.startEdge;
        }

        if (this.values.scrollX > this.values.endEdge) {
            this.values.scrollX = this.values.endEdge;
        }

        this.animationController.start({
            x: this.values.scrollX,
            onResolve: this.onAnimationEnd,
            config: SCROLL_END_ANIMATION_CONFIG,
        });
    };

    public addHandler = (
        ...args: Parameters<typeof this.handlersController.addHandler>
    ): HandlersController<typeof ScrollHandlerTypes, IScrollEvent> => {
        return this.handlersController.addHandler(args[0], args[1]);
    };

    public destroy = () => {
        this.gesturesController.destroy();
        this.handlersController.destroy();
    };
}

export { SnapScrollableViewInitializer };
