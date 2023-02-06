// Возвращет индекс самой ближейщей(с лева) точки привзяки по отношению к точке скролла
export const getBottomSnapSlideByScrollPosition = (
    snapPoints: number[],
    scrollPosition: number,
) => {
    if (scrollPosition <= snapPoints[0]) {
        return 0;
    }

    if (scrollPosition >= snapPoints[snapPoints.length - 1]) {
        return snapPoints.length - 1;
    }

    if (scrollPosition === snapPoints[snapPoints.length - 1]) {
        return snapPoints.length - 2;
    }

    return snapPoints.findIndex((snapPosition, index) => {
        return scrollPosition >= snapPosition && scrollPosition < snapPoints[index + 1];
    });
};
