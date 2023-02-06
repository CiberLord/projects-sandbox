import { getBottomSnapSlideByScrollPosition } from './getBottomSnapSlideByScrollPosition';

export const getSnapPointsInRange = (snapPoints: number[], start: number, end: number) => {
    const lowIndex = getBottomSnapSlideByScrollPosition(snapPoints, start);
    const highIndex = getBottomSnapSlideByScrollPosition(snapPoints, end);

    return {
        lowIndex,
        highIndex,
    };
};
