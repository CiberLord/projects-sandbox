import { getPaddings, calcSnapPointsAccordingScrollWidth } from './helpers';
import uniq from 'lodash/uniq';

interface IOptions {
    container: HTMLDivElement;
    wrapper: HTMLDivElement;
    slidesTrack: HTMLDivElement;
    slides: HTMLDivElement[];
    centered?: boolean;
}

/*
    Вычисляет точки привязки для каждого слайда, но с учетом ширины скролла, как при нативном скроллее.
    При свайпе к последнему слайду, тот будет залипать к концу контейнера
*/
export const getSnapPointsAccordingScrollWidth = ({
    container,
    wrapper,
    slidesTrack,
    slides,
}: IOptions): number[] => {
    const containerPaddings = getPaddings(container);
    const wrapperPaddings = getPaddings(wrapper);

    const paddingsOffset = [
        containerPaddings.left,
        containerPaddings.right,
        wrapperPaddings.left,
        wrapperPaddings.right,
    ].reduce((acc, value) => {
        return acc + value;
    }, 0);

    const viewportWidth = container.getBoundingClientRect().width;
    const viewportInnerWidth = viewportWidth - paddingsOffset;

    const trackScrollWidth = slidesTrack.scrollWidth;

    const slidesPositions = slides.map((slide) => {
        return slide.offsetLeft;
    });

    return uniq(
        calcSnapPointsAccordingScrollWidth(viewportInnerWidth, trackScrollWidth, slidesPositions),
    );
};
