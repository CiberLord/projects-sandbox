import { getBottomSnapSlideByScrollPosition } from './helpers';

export enum IDirection {
    LEFT = -1,
    RIGHT = 1,
}

interface IOptions {
    container: HTMLDivElement;
    slidesTrack: HTMLDivElement;
    snapPoints: number[];
    currentScrollPosition: number;
    direction: IDirection;
}
export const getUpdatedPositionByArrowDirection = ({
    container,
    slidesTrack,
    snapPoints,
    currentScrollPosition,
    direction,
}: IOptions): number => {
    const viewportSize = container.getBoundingClientRect().width;

    const maxScrollSize = slidesTrack.scrollWidth - viewportSize;

    const fullScreenScrollPosition = currentScrollPosition + direction * viewportSize;

    const updatedScrollPosition = Math.min(fullScreenScrollPosition, maxScrollSize);

    const slide = getBottomSnapSlideByScrollPosition(snapPoints, updatedScrollPosition);

    console.log('fullScreenScrollPosition = ', fullScreenScrollPosition, ' slide = ', slide);

    return slide;
};
