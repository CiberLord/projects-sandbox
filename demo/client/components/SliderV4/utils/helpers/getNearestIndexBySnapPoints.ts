import { getLowIndexBySnapPoints } from './getLowIndexBySnapPoints';

export const getNearestIndexBySnapPoints = (
    snapPoints: number[],
    scrollPosition: number,
): number => {
    const lowIndex = getLowIndexBySnapPoints(snapPoints, scrollPosition);

    const highIndex = Math.min(snapPoints.length - 1, lowIndex + 1);

    const triggerPosition = (snapPoints[lowIndex] + snapPoints[highIndex]) / 2;

    return scrollPosition < triggerPosition ? lowIndex : highIndex;
};
