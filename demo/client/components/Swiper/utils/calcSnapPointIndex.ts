//возвращает индекс самого ближайщего числа  к значению - value
export const calcSnapPointIndex = (snapPoints: number[], touchPosition: number) => {
    if (touchPosition > snapPoints[0]) {
        return 0;
    }
    if (touchPosition < snapPoints[snapPoints.length - 1]) {
        return snapPoints.length - 1;
    }

    //тут находится нижний индекс в промежутке, где лежит число value
    const resolveIndex = snapPoints.findIndex((item, index) => {
        return touchPosition <= item && touchPosition >= snapPoints[index + 1];
    });

    const middle = (snapPoints[resolveIndex] + snapPoints[resolveIndex + 1]) / 2;

    return touchPosition < middle ? resolveIndex + 1 : resolveIndex;
};
