import { getPaddings } from './getPaddings';
import { getMaxScrollValue } from './getMaxScrollValue';

interface ICalcSnapPointsOptions {
    containerElement: HTMLDivElement;
    scrollableElement: HTMLDivElement;
    slideElements: HTMLDivElement[];
    centered?: boolean;
}

type SortedArray = number[];

export function calcSnapPoints(options: ICalcSnapPointsOptions): SortedArray {
    if (options.centered) {
        return calcSnapPointsToSafeScroll(options);
    }

    return calcSnapPointsToNativeScroll(options);
}

export function calcSnapPointsToSafeScroll({
    containerElement,
    slideElements,
    centered,
}: ICalcSnapPointsOptions): SortedArray {
    const viewportSize = containerElement.getBoundingClientRect().width;

    return slideElements.map((slideElement) => {
        const slideWidth = slideElement.getBoundingClientRect().width;

        let position = slideElement.offsetLeft;

        if (centered) {
            position = position - (viewportSize - slideWidth) / 2;
        }

        return position;
    });
}

export function calcSnapPointsToNativeScroll({
    containerElement,
    scrollableElement,
    slideElements,
}: ICalcSnapPointsOptions): SortedArray {
    const maxScroll = getMaxScrollValue(containerElement, scrollableElement);
    const draggablePaddings = getPaddings(scrollableElement);

    return slideElements.map((slideElement) => {
        if (slideElement.offsetLeft > maxScroll) {
            return maxScroll + draggablePaddings.right;
        }
        return slideElement.offsetLeft - draggablePaddings.left;
    });
}
