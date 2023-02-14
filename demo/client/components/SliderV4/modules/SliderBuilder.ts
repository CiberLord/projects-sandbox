import { ISliderEvent, ISliderOptions, SliderEvents, ISliderBuilderContext } from '../types';

export class SliderBuilder<Options extends ISliderOptions = ISliderOptions> {
    protected containerElement: HTMLDivElement;
    protected scrollableElement: HTMLDivElement;
    protected slideElements: HTMLDivElement[];
    protected dispatchEvent: (type: SliderEvents, event: ISliderEvent) => void;
    protected activeSlide: number;
    protected options: Options;

    constructor(context: ISliderBuilderContext, options: Options) {
        this.containerElement = context.containerElement;
        this.scrollableElement = context.scrollableElement;
        this.slideElements = context.slideElements;
        this.dispatchEvent = context.dispatchEvent;
        this.options = options;
        this.activeSlide = options.activeSlide || 0;
    }
}
