interface IPaddings {
    left: number;
    right: number;
}

export const getPaddings = (element: Element): IPaddings => {
    const styles = window.getComputedStyle(element);

    return {
        left: parseFloat(styles.paddingLeft),
        right: parseFloat(styles.paddingRight),
    };
};

export const calcSnapPointsAccordingScrollWidth = (
    viewportSize: number,
    scrollSize: number,
    slidesPositions: number[],
) => {
    const snapPoints: number[] = [];

    slidesPositions.forEach((currentPosition, index) => {
        // получаем конечную границу вьюпорта от позиции текущего слайда
        const viewportEndPosition = currentPosition + viewportSize;

        // проверяется можно ли скроллить дальше, если да, то ставим текущую позицию слайда
        if (scrollSize > viewportEndPosition) {
            return snapPoints.push(currentPosition);
        }

        // смещение границы вьюпорта относительно ширины скролла
        const offset = viewportEndPosition - scrollSize;

        const position = Math.max(currentPosition - offset, 0);

        return snapPoints.push(position);
    });

    return snapPoints;
};
