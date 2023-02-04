import { getPaddings } from './getPaddings';

export const getMaxScrollWidth = (
    container: HTMLDivElement,
    scrollableView: HTMLDivElement,
): number => {
    const { left, right } = getPaddings(container);

    const viewportWidth = container.getBoundingClientRect().width - (left + right);

    return scrollableView.scrollWidth - viewportWidth;
};
