import { getBottomSnapSlideByScrollPosition } from './getBottomSnapSlideByScrollPosition';

// Возвращает индекс самой ближайщей точки привязки к текущей точки касания(скролла)
export const getCurrentSnapPointSlide = (snapPoints: number[], scrollPosition: number) => {
    const bottomSlide = getBottomSnapSlideByScrollPosition(snapPoints, scrollPosition);

    const topSlide = Math.min(snapPoints.length - 1, bottomSlide + 1);

    const triggerPosition = (snapPoints[bottomSlide] + snapPoints[topSlide]) / 2;

    return scrollPosition < triggerPosition ? bottomSlide : topSlide;
};
