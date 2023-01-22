interface IGetSnapPointsConfig {
    swiper: HTMLDivElement;
    slidesContainer: HTMLDivElement;
    slides: HTMLDivElement[];

    centered?: boolean;
}

export const getSnapPoints = ({ swiper, slidesContainer, slides, centered }: IGetSnapPointsConfig): number[] => {
    const snapPoints: number[] = [];
    const swiperCSS = window.getComputedStyle(swiper);
    const rootPaddingLeft = parseFloat(swiperCSS.paddingLeft);
    const rootPaddingRight = parseFloat(swiperCSS.paddingRight);
    const viewport = swiper.getBoundingClientRect().width;
    const slidesWidth = slidesContainer.scrollWidth;

    if (centered) {
        slides.forEach((slide) => {
            const position = slide.offsetLeft;
            const slideWidth = slide.getBoundingClientRect().width;
            const centerX = (viewport - slideWidth) / 2 - rootPaddingLeft;

            snapPoints.push(-1 * (position - centerX));
        });
    } else {
        slides.forEach((slide) => {
            let snapPoint;

            const position = slide.offsetLeft;
            const restWidth = slidesWidth - position;
            const maxScrollOffset = viewport - restWidth;

            if (maxScrollOffset >= 0) {
                snapPoint = -1 * (position - maxScrollOffset + (rootPaddingRight + rootPaddingLeft));
            } else {
                snapPoint = -1 * position;
            }

            snapPoints.push(snapPoint);
        });
    }

    return snapPoints;
};
