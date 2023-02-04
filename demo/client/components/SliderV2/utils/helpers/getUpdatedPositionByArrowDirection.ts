import { getBottomSnapSlideByScrollPosition } from './getBottomSnapSlideByScrollPosition';
import { getMaxScrollWidth } from './getMaxScrollWidth';

export enum IDirection {
    LEFT = -1,
    RIGHT = 1,
}

interface IOptions {
    container: HTMLDivElement;
    list: HTMLDivElement;
    snapPoints: number[];
    currentScrollPosition: number;
    direction: IDirection;
}

// Возвращает индекс самой крайней точки привязки в видимой части контейнера
export const getUpdatedPositionByArrowDirection = ({
    container,
    list,
    snapPoints,
    currentScrollPosition,
    direction,
}: IOptions): number => {
    const viewportSize = container.getBoundingClientRect().width;

    const maxScrollWidth = getMaxScrollWidth(container, list);

    const fullScreenScrollPosition = currentScrollPosition + direction * viewportSize;

    const updatedScrollPosition = Math.min(fullScreenScrollPosition, maxScrollWidth);

    return getBottomSnapSlideByScrollPosition(snapPoints, updatedScrollPosition);
};
