import { calcSnapPointsAccordingScrollWidth, getPaddings } from './helpers';
import uniq from 'lodash/uniq';

interface IOptions {
    container: HTMLDivElement;
    slidesTrack: HTMLDivElement;
    slides: HTMLDivElement[];
}

/*
    Вычисляет точки привязки для каждого слайда, но с учетом ширины скролла, как при нативном скроллее.
    При свайпе к последнему слайду, тот будет залипать к концу контейнера
*/
export const getSnapPointsAccordingScrollWidth = ({
    container,
    slidesTrack,
    slides,
}: IOptions): number[] => {
    const containerPaddings = getPaddings(container);

    const paddingsOffset = [containerPaddings.left, containerPaddings.right].reduce(
        (acc, value) => {
            return acc + value;
        },
        0,
    );

    const viewportInnerWidth = container.getBoundingClientRect().width - paddingsOffset;

    const trackScrollWidth = slidesTrack.scrollWidth;

    const slidesPositions = slides.map((slide) => {
        return slide.offsetLeft;
    });

    return uniq(
        calcSnapPointsAccordingScrollWidth(viewportInnerWidth, trackScrollWidth, slidesPositions),
    );
};
