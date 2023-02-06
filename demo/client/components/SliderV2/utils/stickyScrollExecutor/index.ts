import { Controller as AnimationController } from '@react-spring/web';

import { EventsObserver } from '../eventsObserver';

import { IDragEventsEntity } from '../createDragEvents/types';
import { createDragEvents } from '../createDragEvents';
import { getInToRange } from '../helpers/getInToRange';
import { getMaxScrollWidth } from '../helpers/getMaxScrollWidth';
import { getCurrentSnapPointSlide } from '../helpers/getCurrentSnapPointSlide';
import { EDGE_TENSION, SCROLL_ANIMATION_CONFIG, SCROLL_END_ANIMATION_CONFIG } from './consts';
import { IScrollEvent, IStickyScrollExecutorOptions, ScrollEvents } from './types';

class StickyScrollExecutor {
    static eventTypes = ScrollEvents;

    private scrollValue: number;
    private currentSnapPoint: number;
    private startEdge: number;
    private endEdge: number;
    private readonly snapPoints: number[];
    private dragEvents: IDragEventsEntity;
    private animation: AnimationController<{ scrollValue: number }>;
    private eventsObserver: EventsObserver<typeof ScrollEvents, IScrollEvent>;

    constructor(options: IStickyScrollExecutorOptions) {
        this.snapPoints = options.snapPoints;
        this.initValues(options);
        this.initEventsObserver();
        this.initAnimation(options);
        this.initDragEvents(options);
    }

    private initValues = (options: IStickyScrollExecutorOptions) => {
        const maxScrollWidth = getMaxScrollWidth(options.containerNode, options.scrollableNode);
        const lasSnapPointPosition = options.snapPoints[options.snapPoints.length - 1];

        this.scrollValue = 0;
        this.currentSnapPoint = 0;
        this.startEdge = options.snapPoints[0];
        this.endEdge = options.safeEdges ? lasSnapPointPosition : maxScrollWidth;
    };

    private initEventsObserver = () => {
        this.eventsObserver = new EventsObserver({
            types: ScrollEvents,
        });
    };

    private initAnimation = (options: IStickyScrollExecutorOptions) => {
        this.animation = new AnimationController({
            scrollValue: 0,
            onChange: (event) => {
                this.scrollValue = event.value.scrollValue;

                const translateX = this.getTransform(event.value.scrollValue);

                options.scrollableNode.style.transform = `translate3d(${translateX}px, 0px, 0px)`;

                this.dispatchScroll();
            },
            onStart: (event) => {
                this.scrollValue = event.value.scrollValue;
                this.dispatchScrollStart();
            },
        });
    };

    private initDragEvents = (options: IStickyScrollExecutorOptions) => {
        this.dragEvents = createDragEvents(options.containerNode, {
            onMove: ({ delta }) => {
                const updatedPosition = this.getUpdatedPosition(delta.x);

                this.animation.start({
                    scrollValue: updatedPosition,
                    config: SCROLL_ANIMATION_CONFIG,
                });
            },
            onMoveEnd: ({ delta }) => {
                const updatedPosition = this.getUpdatedPosition(delta.x);
                this.scrollTo(updatedPosition);
            },
            onSwipe: ({ direction }) => {
                this.currentSnapPoint = getInToRange(
                    this.currentSnapPoint - direction.x,
                    0,
                    this.snapPoints.length,
                );

                this.scrollTo(this.getCurrentSnapPointPosition());

                this.eventsObserver.dispatchEvent(ScrollEvents.SWIPE, this.getEvent());
            },
        });
    };

    public scrollTo = (scrollPosition: number) => {
        this.currentSnapPoint = getCurrentSnapPointSlide(this.snapPoints, scrollPosition);

        this.animation.start({
            scrollValue: this.snapPoints[this.currentSnapPoint],
            onRest: () => {
                this.scrollValue = this.getCurrentSnapPointPosition();
                this.dispatchScrollEnd();
            },
            config: SCROLL_END_ANIMATION_CONFIG,
        });
    };

    public addListener = (...args: Parameters<typeof this.eventsObserver.addListener>) => {
        return this.eventsObserver.addListener(...args);
    };

    public destroy = () => {
        this.dragEvents.destroy();
        this.eventsObserver.clean();
    };

    private dispatchScrollStart = () => {
        this.eventsObserver.dispatchEvent(ScrollEvents.SCROLL_START, this.getEvent());
    };

    private dispatchScroll = () => {
        this.eventsObserver.dispatchEvent(ScrollEvents.SCROLL, this.getEvent());
    };

    private dispatchScrollEnd = () => {
        this.eventsObserver.dispatchEvent(ScrollEvents.SCROLL_END, this.getEvent());
    };

    private getEvent = (): IScrollEvent => {
        return {
            currentSnapPoint: this.currentSnapPoint,
            scrollValue: this.scrollValue,
        };
    };

    private getUpdatedPosition = (delta: number) => {
        let updatedPosition = this.getCurrentSnapPointPosition() - delta;

        if (updatedPosition < this.startEdge) {
            updatedPosition = this.startEdge + EDGE_TENSION * updatedPosition;
        }

        if (updatedPosition > this.endEdge) {
            const offset = updatedPosition - this.endEdge;

            updatedPosition = this.endEdge + EDGE_TENSION * offset;
        }

        return updatedPosition;
    };

    private getCurrentSnapPointPosition = () => {
        return this.snapPoints[this.currentSnapPoint];
    };

    private getTransform = (scrollPosition: number) => {
        return -1 * scrollPosition;
    };
}

export { StickyScrollExecutor };
