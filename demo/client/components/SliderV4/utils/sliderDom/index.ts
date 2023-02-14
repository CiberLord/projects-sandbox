import { EventsEmitter } from '../eventsEmitter';

export enum DomEvents {
    addSlide = 'addSlide',
    removeSlide = 'removeSlide',
}

type SliderDomSlide = HTMLDivElement;

class SliderDom {
    static events = DomEvents;

    containerElement?: HTMLDivElement;
    scrollableElement?: HTMLDivElement;
    slideElements: HTMLDivElement[] = [];

    private emitter = new EventsEmitter<typeof DomEvents, SliderDomSlide>({
        types: DomEvents,
    });

    public getContainerElement = (): HTMLDivElement => {
        if (!this.containerElement) {
            throw new Error('containerElement is null');
        }

        return this.containerElement;
    };

    public setContainerElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.containerElement = el;
        }
    };

    public getScrollableElement = (): HTMLDivElement => {
        if (!this.scrollableElement) {
            throw new Error('scrollableElement is null');
        }

        return this.scrollableElement;
    };

    public setScrollableElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.scrollableElement = el;
        }
    };

    public getSlideElements = (): HTMLDivElement[] => {
        return this.slideElements;
    };

    public addSlideElement = (el: HTMLDivElement | null) => {
        if (el) {
            this.slideElements.push(el);
            this.emitter.dispatchEvent(DomEvents.addSlide, el);
        }
    };

    public removeSlideElement = (el: HTMLDivElement | null) => {
        const targetIndex = this.slideElements.findIndex((elem) => elem === el);

        if (targetIndex > -1 && el) {
            this.slideElements.splice(targetIndex, 1);
            this.emitter.dispatchEvent(DomEvents.removeSlide, el);
        }
    };

    public addListener = (type: DomEvents, listener: (event: SliderDomSlide) => void) => {
        this.emitter.addListener(type, listener);
    };
}

export { SliderDom };
