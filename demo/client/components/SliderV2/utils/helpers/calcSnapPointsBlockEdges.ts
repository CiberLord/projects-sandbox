import { getPaddings } from './getPaddings';

interface IOptions {
    container: HTMLDivElement;
    list: HTMLDivElement;
    slides: HTMLDivElement[];
}
export const calcSnapPointsBlockEdges = (options: IOptions) => {
    const { container, list, slides } = options;

    const containerPaddings = getPaddings(container);

    const paddingsOffset = [containerPaddings.left, containerPaddings.right].reduce(
        (acc, value) => {
            return acc + value;
        },
        0,
    );

    const viewportWidth = container.getBoundingClientRect().width - paddingsOffset;

    const scrollWidth = list.scrollWidth;

    const slidesPositions = slides.map((slide) => {
        return slide.offsetLeft;
    });

    const snapPoints: number[] = [];

    slidesPositions.forEach((currentPosition, index) => {
        // получаем конечную границу контейнера от позиции текущего слайда
        const viewportEdgeEnd = currentPosition + viewportWidth;

        const prevPosition = snapPoints[index - 1] || 0;

        // проверяется можно ли скроллить дальше, если да, то ставим текущую позицию слайда
        if (scrollWidth > viewportEdgeEnd) {
            return snapPoints.push(currentPosition);
        }

        // смещение границы контейнера относительно ширины скролла
        const offset = viewportEdgeEnd - scrollWidth;

        const position = Math.max(currentPosition - offset, 0);

        return prevPosition !== position && snapPoints.push(position);
    });

    return snapPoints;
};
