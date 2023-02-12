export const getMaxScrollValue = (
    containerElement: HTMLDivElement,
    draggableElement: HTMLDivElement,
): number => {
    const viewportSize = containerElement.getBoundingClientRect().width;

    return draggableElement.scrollWidth - viewportSize;
};
