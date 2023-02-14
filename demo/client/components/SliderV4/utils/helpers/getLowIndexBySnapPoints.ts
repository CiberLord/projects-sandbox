export const getLowIndexBySnapPoints = (snapPoints: number[], scrollPosition: number): number => {
    let targetIndex = -1;

    for (let index = 0; index < snapPoints.length; index++) {
        if (scrollPosition <= snapPoints[index]) {
            break;
        }

        targetIndex++;
    }

    return Math.max(0, targetIndex);
};
