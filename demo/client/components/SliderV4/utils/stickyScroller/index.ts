import { Controller as AnimationController } from '@react-spring/web';

import { EventsEmitter } from '../eventsEmitter';

import { IDragEventsEntity } from '../createDragEvents/types';
import { createDragEvents } from '../createDragEvents';
import { getNearestIndexBySnapPoints } from '../helpers/getNearestIndexBySnapPoints';
import { EDGE_TENSION, SCROLL_ANIMATION_CONFIG, SCROLL_END_ANIMATION_CONFIG } from './consts';
import { IScrollEvent, IStickyScrollerCreateOptions, ScrollEvents } from './types';

class StickyScroller {
    private scrollValue: number;
    private currentSnapPointIndex: number;
    private dragEvents: IDragEventsEntity;
    private animation: AnimationController<{ scrollValue: number }>;
    private eventsObserver: EventsEmitter<typeof ScrollEvents, IScrollEvent>;
    private snapPoints: number[];
    private startEdge: number;
    private endEdge: number;

    constructor(options: IStickyScrollerCreateOptions) {
        this.snapPoints = options.snapPoints;
        this.scrollValue = 0;
        this.currentSnapPointIndex = options.currentSnapPointIndex || 0;
        this.startEdge = this.snapPoints[0];
        this.endEdge = options.snapPoints[options.snapPoints.length - 1];

        this.eventsObserver = new EventsEmitter({
            types: ScrollEvents,
        });

        this.animation = new AnimationController({
            scrollValue: 0,
            onChange: (event) => {
                this.scrollValue = event.value.scrollValue;

                const translateX = this.getTransform(event.value.scrollValue);

                options.draggableElement.style.transform = `translate3d(${translateX}px, 0px, 0px)`;

                this.dispatchScrollEvent();
            },
            onStart: (event) => {
                this.scrollValue = event.value.scrollValue;
                this.dispatchScrollStartEvent();
            },
        });

        this.dragEvents = createDragEvents(options.containerElement, {
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
                const updateSnapPointIndex = this.currentSnapPointIndex - direction.x;

                this.scrollTo(this.snapPoints[updateSnapPointIndex]);
                this.eventsObserver.dispatchEvent(ScrollEvents.swipe, this.getEvent());
            },
        });
    }

    public scrollTo(scrollPosition?: number) {
        if (scrollPosition === undefined) {
            this.scrollTo(this.getCurrentSnapPointIndexPosition());
            return;
        }

        this.setCurrentSnapPointIndex(getNearestIndexBySnapPoints(this.snapPoints, scrollPosition));

        this.animation.start({
            scrollValue: this.getCurrentSnapPointIndexPosition(),
            onRest: () => {
                this.scrollValue = this.getCurrentSnapPointIndexPosition();
                this.dispatchScrollEndEvent();
            },
            config: SCROLL_END_ANIMATION_CONFIG,
        });
    }

    public addListener(...args: Parameters<typeof this.eventsObserver.addListener>) {
        return this.eventsObserver.addListener(...args);
    }

    public destroy() {
        this.dragEvents.destroy();
        this.eventsObserver.clean();
    }

    public getScrollValue() {
        return this.scrollValue;
    }

    public setSnapPoints(snapPoints: number[]) {
        this.snapPoints = snapPoints;
    }

    private getUpdatedPosition(delta: number) {
        let updatedPosition = this.getCurrentSnapPointIndexPosition() - delta;

        if (updatedPosition < this.startEdge) {
            updatedPosition = this.startEdge + EDGE_TENSION * updatedPosition;
        }

        if (updatedPosition > this.endEdge) {
            const offset = updatedPosition - this.endEdge;

            updatedPosition = this.endEdge + EDGE_TENSION * offset;
        }

        return updatedPosition;
    }

    private setCurrentSnapPointIndex(index: number) {
        if (index < 0 || index >= this.snapPoints.length) {
            return;
        }
        this.currentSnapPointIndex = index;
    }

    private getCurrentSnapPointIndexPosition() {
        return this.snapPoints[this.currentSnapPointIndex];
    }

    private getTransform(scrollPosition: number) {
        return -1 * scrollPosition;
    }

    private dispatchScrollStartEvent() {
        this.eventsObserver.dispatchEvent(ScrollEvents.scrollStart, this.getEvent());
    }

    private dispatchScrollEvent() {
        this.eventsObserver.dispatchEvent(ScrollEvents.scroll, this.getEvent());
    }

    private dispatchScrollEndEvent() {
        this.eventsObserver.dispatchEvent(ScrollEvents.scrollEnd, this.getEvent());
    }

    private getEvent = (): IScrollEvent => {
        return {
            currentSnapPointIndex: this.currentSnapPointIndex,
            scrollValue: this.scrollValue,
        };
    };
}

export { StickyScroller };
