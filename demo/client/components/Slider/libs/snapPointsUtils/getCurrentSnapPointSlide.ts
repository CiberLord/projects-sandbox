export const getCurrentSnapPointSlide = (snapPoints: number[], touchPosition: number) => {
    if (touchPosition < snapPoints[0]) {
        return 0;
    }

    if (touchPosition > snapPoints[snapPoints.length - 1]) {
        return snapPoints.length - 1;
    }

    const bottomSlide = snapPoints.findIndex((snapPosition, index) => {
        return touchPosition > snapPosition && touchPosition < snapPoints[index + 1];
    });

    const topSlide = bottomSlide + 1;

    const triggerPosition = (snapPoints[bottomSlide] + snapPoints[topSlide]) / 2;

    return touchPosition < triggerPosition ? bottomSlide : topSlide;
};
